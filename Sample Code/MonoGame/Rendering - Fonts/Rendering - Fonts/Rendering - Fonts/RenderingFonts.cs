using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using System;

namespace CS5410
{
    public class RenderingFonts : Game
    {
        private const string DEMO_STRING1 = "This is a test";
        private const string DEMO_STRING2 = "This is a different test";
        private const string DEMO_STRING3 = "This is an outline rendering test";

        private GraphicsDeviceManager m_graphics;
        private SpriteBatch m_spriteBatch;

        private SpriteFont m_font1;
        private SpriteFont m_font2;

        private float m_string1Rotation = 0.0f;
        private float m_string2Size = MathHelper.Pi * 2;    // Indirect size, this is actuallly an angle (radians) that is used to scale the size based on a sin wave
        private const float STRING1_ROTATION_RATE = MathHelper.Pi / 4;  // radians per second
        private const float STRING2_SIZE_RATE = MathHelper.Pi / 2;  // radians per second

        public RenderingFonts()
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

            //
            // Update the string rotations - based on elapsed time
            m_string1Rotation += (float)(STRING1_ROTATION_RATE * gameTime.ElapsedGameTime.TotalMilliseconds / 1000.0f);
            // Update the string size - based on elapsed time
            m_string2Size += (float)(STRING2_SIZE_RATE * gameTime.ElapsedGameTime.TotalMilliseconds / 1000.0f);

            base.Update(gameTime);
        }

        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(Color.CornflowerBlue);

            m_spriteBatch.Begin();

            //
            // Show how to draw a string centered at the window top
            Vector2 string1Size = m_font1.MeasureString(DEMO_STRING1);
            m_spriteBatch.DrawString(
                m_font1, 
                DEMO_STRING1, 
                new Vector2(m_graphics.PreferredBackBufferWidth / 2 - string1Size.X / 2, string1Size.X / 2), 
                Color.White,
                m_string1Rotation,
                new Vector2(string1Size.X / 2, string1Size.Y / 2),
                1.0f,
                SpriteEffects.None,
                0);

            //
            // Center a string in the window and vary its size thorugh a sin wave.
            // It isn't obvious, but multiplying the size by the scaling factor keeps the string positioned
            // in the center of the window as the scaling factor changes...along with computing the center of the
            // string each time.
            float scale = (float)Math.Abs(Math.Sin(m_string2Size));
            Vector2 string2Size = m_font2.MeasureString(DEMO_STRING2) * scale;
            m_spriteBatch.DrawString(
                m_font2,
                DEMO_STRING2,
                new Vector2(m_graphics.PreferredBackBufferWidth / 2 - string2Size.X / 2, m_graphics.PreferredBackBufferHeight / 2 - string2Size.Y / 2),
                Color.Black,
                0,
                Vector2.Zero,
                scale,
                SpriteEffects.None,
                0);


            //float scaleOutline = (float)Math.Abs(Math.Sin(m_string2Size));
            float scaleOutline = 1.0f;
            Vector2 string3Size = m_font2.MeasureString(DEMO_STRING3) * scaleOutline;
            drawOutlineText(
                m_spriteBatch, 
                m_font2, DEMO_STRING3, 
                Color.Black, Color.White, 
                new Vector2(
                    m_graphics.PreferredBackBufferWidth / 2 - string3Size.X / 2,
                    m_graphics.PreferredBackBufferHeight / 2 + (m_graphics.PreferredBackBufferHeight / 4 - string3Size.Y / 4)), 
                scaleOutline);

            m_spriteBatch.End();

            base.Draw(gameTime);
        }

        protected static void drawOutlineText(SpriteBatch spriteBatch, SpriteFont font, string text, Color backColor, Color frontColor, Vector2 position, float scale)
        {
            const float PIXEL_OFFSET = 1.0f;
            //
            // Offset to the upper left and lower right - faster, but not as good
            //spriteBatch.DrawString(font, text, position - new Vector2(PIXEL_OFFSET * scale, PIXEL_OFFSET * scale), backColor, 0, Vector2.Zero, scale, SpriteEffects.None, 1f);
            //spriteBatch.DrawString(font, text, position + new Vector2(PIXEL_OFFSET * scale, PIXEL_OFFSET * scale), backColor, 0, Vector2.Zero, scale, SpriteEffects.None, 1f);

            //
            // Offset in each of left,right, up, down directions - slower, but good
            spriteBatch.DrawString(font, text, position - new Vector2(PIXEL_OFFSET * scale, 0), backColor, 0, Vector2.Zero, scale, SpriteEffects.None, 1f);
            spriteBatch.DrawString(font, text, position + new Vector2(PIXEL_OFFSET * scale, 0), backColor, 0, Vector2.Zero, scale, SpriteEffects.None, 1f);
            spriteBatch.DrawString(font, text, position - new Vector2(0, PIXEL_OFFSET * scale), backColor, 0, Vector2.Zero, scale, SpriteEffects.None, 1f);
            spriteBatch.DrawString(font, text, position + new Vector2(0, PIXEL_OFFSET * scale), backColor, 0, Vector2.Zero, scale, SpriteEffects.None, 1f);

            //
            // This sits inside the text rendering done just above
            spriteBatch.DrawString(font, text, position, frontColor, 0, Vector2.Zero, scale, SpriteEffects.None, 0f);
        }
    }
}
