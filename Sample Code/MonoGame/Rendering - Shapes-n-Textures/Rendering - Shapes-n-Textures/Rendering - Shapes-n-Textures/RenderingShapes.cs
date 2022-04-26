using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace CS5410
{
    public class RenderingShapes : Game
    {
        private GraphicsDeviceManager m_graphics;
        private SpriteBatch m_spriteBatch;

        private Texture2D m_texSessler;
        private Texture2D m_texCircle;
        private Texture2D m_texRectangle;
        private Texture2D m_texCircleBlur;

        private Rectangle m_rectSessler = new Rectangle(100, 100, 400, 400);
        private Rectangle m_rectCircle = new Rectangle(600, 100, 400, 400);
        private Rectangle m_rectRectangle = new Rectangle(1100, 100, 400, 400);
        private Rectangle m_rectRectangle2 = new Rectangle(1400, 800, 400, 400);

        private Rectangle m_rectBlendBackground = new Rectangle(150, 600, 400, 400);
        private Rectangle m_rectCircleRed = new Rectangle(200, 650, 200, 200);
        private Rectangle m_rectCircleGreen = new Rectangle(250, 750, 200, 200);
        private Rectangle m_rectCircleBlue = new Rectangle(300, 700, 200, 200);

        private float m_rotationRectangle2 = 0;

        private const float RECTANGLE2_ROTATION_RATE = MathHelper.Pi / 4;  // radians per second

        public RenderingShapes()
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

            m_texSessler = this.Content.Load<Texture2D>("Images/sessler");
            m_texCircle = this.Content.Load<Texture2D>("Images/circle");
            m_texRectangle = this.Content.Load<Texture2D>("Images/square");
            m_texCircleBlur = this.Content.Load<Texture2D>("Images/circle-blur");
        }

        protected override void UnloadContent()
        {
            // Any code that needs to cleanly unload content should be placed here.  This is a one-time call at termination
            base.UnloadContent();
        }

        protected override void Update(GameTime gameTime)
        {
            // Allows the game to exit
            if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed)
            {
                this.Exit();
            }

            if (Keyboard.GetState().IsKeyDown(Keys.Escape))
            {
                this.Exit();
            }

            m_rotationRectangle2 += (float)(RECTANGLE2_ROTATION_RATE * gameTime.ElapsedGameTime.TotalMilliseconds / 1000.0f);

            base.Update(gameTime);
        }

        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(Color.CornflowerBlue);

            m_spriteBatch.Begin();

            m_spriteBatch.Draw(m_texSessler, m_rectSessler, Color.White);
            m_spriteBatch.Draw(m_texCircle, m_rectCircle, Color.Blue);
            m_spriteBatch.Draw(m_texRectangle, m_rectRectangle, Color.Red);

            m_spriteBatch.Draw(
                m_texRectangle,
                m_rectRectangle2,
                null,   // Drawing the whole texture, not a part
                Color.Green,
                m_rotationRectangle2,
                new Vector2(m_texRectangle.Width / 2, m_texRectangle.Height / 2),
                SpriteEffects.None,
                0);

            //
            // Draw the blend background here, otherwise it would be blended with the cornflower blue background, which we don't want
            m_spriteBatch.Draw(m_texRectangle, m_rectBlendBackground, Color.Black);

            m_spriteBatch.End();

            //
            // Do a separate spritebatch for blending the three circles together
            m_spriteBatch.Begin(SpriteSortMode.Deferred, BlendState.Additive);

            m_spriteBatch.Draw(m_texCircleBlur, m_rectCircleRed, Color.Red);
            m_spriteBatch.Draw(m_texCircleBlur, m_rectCircleGreen, Color.Green);
            m_spriteBatch.Draw(m_texCircleBlur, m_rectCircleBlue, Color.Blue);

            m_spriteBatch.End();

            base.Draw(gameTime);
        }
    }
}
