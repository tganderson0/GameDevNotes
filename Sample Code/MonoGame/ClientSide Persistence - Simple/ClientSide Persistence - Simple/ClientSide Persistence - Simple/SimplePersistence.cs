using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

//
// Added to support serialization
using System.IO;
using System.IO.IsolatedStorage;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace CS5410
{
    public class SimplePersistence : Game
    {
        private GraphicsDeviceManager m_graphics;
        private SpriteBatch m_spriteBatch;

        private SpriteFont m_font;

        //
        // Safeguard against multiple save/load happening at the same time
        private bool saving = false;
        private bool loading = false;

        private const string SAVE_MESSAGE = "F1 - Save Something";
        private const string LOAD_MESSAGE = "F2 - Load Something";

        public SimplePersistence()
        {
            m_graphics = new GraphicsDeviceManager(this);
            Content.RootDirectory = "Content";
            IsMouseVisible = true;
        }

        protected override void Initialize()
        {
            m_graphics.PreferredBackBufferWidth = 1920;
            m_graphics.PreferredBackBufferHeight = 1080;

            m_graphics.ApplyChanges();

            base.Initialize();
        }

        protected override void LoadContent()
        {
            m_spriteBatch = new SpriteBatch(GraphicsDevice);

            m_font = this.Content.Load<SpriteFont>("Fonts/DemoFont");
        }

        protected override void Update(GameTime gameTime)
        {
            if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || Keyboard.GetState().IsKeyDown(Keys.Escape))
            {
                Exit();
            }

            //
            // Save something
            if (Keyboard.GetState().IsKeyDown(Keys.F1) || GamePad.GetState(PlayerIndex.One).Buttons.A == ButtonState.Pressed)
            {
                saveSomething();
            }

            //
            // Load something
            if (Keyboard.GetState().IsKeyDown(Keys.F2) || GamePad.GetState(PlayerIndex.One).Buttons.B == ButtonState.Pressed)
            {
                loadSomething();
            }


            base.Update(gameTime);
        }

        /// <summary>
        /// Demonstrates how serialize an object to storage
        /// </summary>
        private void saveSomething()
        {
            lock (this)
            {
                if (!this.saving)
                {
                    this.saving = true;
                    //
                    // Create something to save
                    GameState myState = new GameState(100000, 20);
                    finalizeSaveAsync(myState);
                }
            }
        }

        private async void finalizeSaveAsync(GameState state)
        {
            await Task.Run(() =>
            {
                using (IsolatedStorageFile storage = IsolatedStorageFile.GetUserStoreForApplication())
                {
                    try
                    {
                        using (IsolatedStorageFileStream fs = storage.OpenFile("HighScores.xml", FileMode.OpenOrCreate))
                        {
                            if (fs != null)
                            {
                                XmlSerializer mySerializer = new XmlSerializer(typeof(GameState));
                                mySerializer.Serialize(fs, state);
                            }
                        }
                    }
                    catch (IsolatedStorageException)
                    {
                        // Ideally show something to the user, but this is demo code :)
                    }
                }

                this.saving = false;
            });
        }

        /// <summary>
        /// Demonstrates how to deserialize an object from storage device
        /// </summary>
        private void loadSomething()
        {
            lock (this)
            {
                if (!this.loading)
                {
                    this.loading = true;
#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
                    finalizeLoadAsync();
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
                }
            }
        }
        private GameState m_loadedState = null;

        private async Task finalizeLoadAsync()
        {
            await Task.Run(() =>
            {
                using (IsolatedStorageFile storage = IsolatedStorageFile.GetUserStoreForApplication())
                {
                    try
                    {
                        if (storage.FileExists("HighScores.xml"))
                        {
                            using (IsolatedStorageFileStream fs = storage.OpenFile("HighScores.xml", FileMode.Open))
                            {
                                if (fs != null)
                                {
                                    XmlSerializer mySerializer = new XmlSerializer(typeof(GameState));
                                    m_loadedState = (GameState)mySerializer.Deserialize(fs);
                                }
                            }
                        }
                    }
                    catch (IsolatedStorageException)
                    {
                        // Ideally show something to the user, but this is demo code :)
                    }
                }

                this.loading = false;
            });
        }

        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(Color.CornflowerBlue);

            m_spriteBatch.Begin();

            //
            // Center these both vertically and horizontally
            Vector2 stringSize = m_font.MeasureString(SAVE_MESSAGE);
            var startY = m_graphics.PreferredBackBufferHeight / 2 - (stringSize.Y * 2 / 2);
            m_spriteBatch.DrawString(m_font, SAVE_MESSAGE, new Vector2(m_graphics.PreferredBackBufferWidth / 2 - stringSize.X / 2, startY), Color.Black);
            startY += stringSize.Y;
            stringSize = m_font.MeasureString(LOAD_MESSAGE);
            m_spriteBatch.DrawString(m_font, LOAD_MESSAGE, new Vector2(m_graphics.PreferredBackBufferWidth / 2 - stringSize.X / 2, startY), Color.Black);

            if (m_loadedState != null)
            {
                Vector2 lineStart = Vector2.Zero;
                m_spriteBatch.DrawString(this.m_font, "Player Name: " + m_loadedState.Name, lineStart, Color.Black);

                lineStart.Y += this.m_font.MeasureString("Player Name: " + m_loadedState.Name).Y;
                m_spriteBatch.DrawString(this.m_font, "Score: " + m_loadedState.Score, lineStart, Color.Black);

                lineStart.Y += this.m_font.MeasureString("Score: " + m_loadedState.Score).Y;
                m_spriteBatch.DrawString(this.m_font, "Level: " + m_loadedState.Level, lineStart, Color.Black);

                lineStart.Y += this.m_font.MeasureString("Level: " + m_loadedState.Level).Y;
                m_spriteBatch.DrawString(this.m_font, "Time Stamp: " + m_loadedState.TimeStamp, lineStart, Color.Black);
            }

            m_spriteBatch.End();

            base.Draw(gameTime);
        }
    }
}
