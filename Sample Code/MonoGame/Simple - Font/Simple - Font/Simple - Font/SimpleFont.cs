using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace CS5410
{
    public class SimpleFont : Game
    {
        private GraphicsDeviceManager m_graphics;
        private SpriteBatch m_spriteBatch;
        private SpriteFont m_font1;
        private SpriteFont m_font2;

        private const string DEMO_STRING1 = "This is a test";
        private const string DEMO_STRING2 = "This is a different test";

        public SimpleFont()
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

            m_font1 = this.Content.Load<SpriteFont>("Fonts/DemoFont1");
            m_font2 = this.Content.Load<SpriteFont>("Fonts/DemoFont2");
        }

        protected override void Update(GameTime gameTime)
        {
            if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || Keyboard.GetState().IsKeyDown(Keys.Escape))
            {
                Exit();
            }


            base.Update(gameTime);
        }

        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(Color.CornflowerBlue);

            m_spriteBatch.Begin();

            //
            // Show how to draw a string at the window origin
            m_spriteBatch.DrawString(m_font1, DEMO_STRING1, new Vector2(0, 0), Color.White);
            //
            // Center a string in the window
            Vector2 stringSize = m_font2.MeasureString(DEMO_STRING2);
            m_spriteBatch.DrawString(m_font2, DEMO_STRING2, new Vector2(m_graphics.PreferredBackBufferWidth / 2 - stringSize.X / 2, m_graphics.PreferredBackBufferHeight / 2 - stringSize.Y / 2), Color.Black);

            m_spriteBatch.End();

            base.Draw(gameTime);
        }
    }
}
