using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Audio;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using Microsoft.Xna.Framework.Media;

namespace CS5410
{
    public class SimpleAudio : Game
    {
        private GraphicsDeviceManager m_graphics;
        private SpriteBatch m_spriteBatch;
        private SpriteFont m_font;

        private SoundEffect m_sound1;
        private SoundEffect m_sound2;
        private Song m_music;


        private bool m_canPlaySound1 = true;
        private bool m_canPlaySound2 = true;
        private bool m_canPlayMusic = true;

        private const string SOUND1_MESSAGE = "F1 - Play Effect 1";
        private const string SOUND2_MESSAGE = "F2 - Play Effect 2";
        private const string MUSIC_MESSAGE1 = "F3 - Play Music";
        private const string MUSIC_MESSAGE2 = "F4 - Stop Music";

        public SimpleAudio()
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

            m_font = this.Content.Load<SpriteFont>("Fonts/AudioFont");

            // Reference: https://freesound.org/data/previews/156/156031_2703579-lq.mp3
            m_sound1 = this.Content.Load<SoundEffect>("Audio/sound-1");
            // Reference: https://freesound.org//data/previews/109/109662_945474-lq.mp3
            m_sound2 = this.Content.Load<SoundEffect>("Audio/sound-2");
            // This file is not kept in the repo, you'll need to download it each time it is demod
            // Reference: https://www.bensound.com/royalty-free-music/track/extreme-action
            m_music = this.Content.Load<Song>("Audio/bensound-extremeaction");
        }

        protected override void Update(GameTime gameTime)
        {
            if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || Keyboard.GetState().IsKeyDown(Keys.Escape))
            {
                Exit();
            }

            if (Keyboard.GetState().IsKeyDown(Keys.F1) && m_canPlaySound1)
            {
                m_sound1.Play();
                m_canPlaySound1 = false;
            }
            if (Keyboard.GetState().IsKeyDown(Keys.F2) && m_canPlaySound2)
            {
                m_sound2.Play();
                m_canPlaySound2 = false;
            }
            if (Keyboard.GetState().IsKeyDown(Keys.F3) && m_canPlayMusic)
            {
                MediaPlayer.Play(m_music);
                m_canPlayMusic = false;
            }
            if (Keyboard.GetState().IsKeyDown(Keys.F4))
            {
                MediaPlayer.Stop();
                m_canPlayMusic = true;
            }

            m_canPlaySound1 = Keyboard.GetState().IsKeyUp(Keys.F1);
            m_canPlaySound2 = Keyboard.GetState().IsKeyUp(Keys.F2);

            base.Update(gameTime);
        }

        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(Color.CornflowerBlue);

            m_spriteBatch.Begin();

            //
            // Center these both vertically and horizontally
            Vector2 stringSize = m_font.MeasureString(SOUND1_MESSAGE);
            var startY = m_graphics.PreferredBackBufferHeight / 2 - (stringSize.Y * 4 / 2);
            m_spriteBatch.DrawString(m_font, SOUND1_MESSAGE, new Vector2(m_graphics.PreferredBackBufferWidth / 2 - stringSize.X / 2, startY), Color.Black);
            startY += stringSize.Y;
            stringSize = m_font.MeasureString(SOUND2_MESSAGE);
            m_spriteBatch.DrawString(m_font, SOUND2_MESSAGE, new Vector2(m_graphics.PreferredBackBufferWidth / 2 - stringSize.X / 2, startY), Color.Black);
            startY += stringSize.Y;
            stringSize = m_font.MeasureString(MUSIC_MESSAGE1);
            m_spriteBatch.DrawString(m_font, MUSIC_MESSAGE1, new Vector2(m_graphics.PreferredBackBufferWidth / 2 - stringSize.X / 2, startY), Color.Black);
            startY += stringSize.Y;
            stringSize = m_font.MeasureString(MUSIC_MESSAGE2);
            m_spriteBatch.DrawString(m_font, MUSIC_MESSAGE2, new Vector2(m_graphics.PreferredBackBufferWidth / 2 - stringSize.X / 2, startY), Color.Black);

            m_spriteBatch.End();

            base.Draw(gameTime);
        }
    }
}
