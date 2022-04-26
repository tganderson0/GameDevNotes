using CS5410.Input;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using System;

namespace CS5410
{
    public class Keyboard3 : Game
    {
        private GraphicsDeviceManager m_graphics;
        private SpriteBatch m_spriteBatch;

        private KeyboardInput m_inputKeyboard;

        private Texture2D m_texSessler;
        private Rectangle m_rectSessler = new Rectangle(200, 200, 400, 400);
        private float m_rotationSessler = 0;
        private const float SPRITE_MOVE_PIXELS_PER_MS = 300.0f / 1000.0f;
        private const float SPRITE_ROTATE_RADIANS_PER_MS = (MathHelper.Pi / 2) / 1000.0f;

        public Keyboard3()
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

            //
            // Setup input handlers
            m_inputKeyboard = new KeyboardInput();

            m_inputKeyboard.registerCommand(Keys.W, false, new InputDeviceHelper.CommandDelegate(onMoveUp));
            m_inputKeyboard.registerCommand(Keys.S, false, new InputDeviceHelper.CommandDelegate(onMoveDown));
            m_inputKeyboard.registerCommand(Keys.A, false, new InputDeviceHelper.CommandDelegate(onMoveLeft));
            m_inputKeyboard.registerCommand(Keys.D, false, new InputDeviceHelper.CommandDelegate(onMoveRight));
            m_inputKeyboard.registerCommand(Keys.Q, false, new InputDeviceHelper.CommandDelegate(onRotateLeft));
            m_inputKeyboard.registerCommand(Keys.E, false, new InputDeviceHelper.CommandDelegate(onRotateRight));

            m_inputKeyboard.registerCommand(Keys.Up, false, new InputDeviceHelper.CommandDelegate(onMoveUp));
            m_inputKeyboard.registerCommand(Keys.Down, false, new InputDeviceHelper.CommandDelegate(onMoveDown));
            m_inputKeyboard.registerCommand(Keys.Left, false, new InputDeviceHelper.CommandDelegate(onMoveLeft));
            m_inputKeyboard.registerCommand(Keys.Right, false, new InputDeviceHelper.CommandDelegate(onMoveRight));

            base.Initialize();
        }

        protected override void LoadContent()
        {
            m_spriteBatch = new SpriteBatch(GraphicsDevice);

            m_texSessler = this.Content.Load<Texture2D>("Images/sessler");
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

            m_inputKeyboard.Update(gameTime);

            base.Update(gameTime);
        }

        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(Color.CornflowerBlue);

            m_spriteBatch.Begin();

            m_spriteBatch.Draw(
                m_texSessler,
                m_rectSessler,
                null,
                Color.White,
                m_rotationSessler,
                new Vector2(m_texSessler.Width / 2, m_texSessler.Height / 2),
                SpriteEffects.None,
                0);

            m_spriteBatch.End();

            base.Draw(gameTime);
        }


        #region Input Handlers
        /// <summary>
        /// The various moveX methods subtract half of the height/width because the rendering is performed
        /// from the center of the rectangle because it can rotate
        /// </summary>
        private void onMoveUp(GameTime gameTime, float scale)
        {
            if (m_rectSessler.Y > m_rectSessler.Height / 2)
            {
                int moveDistance = (int)(gameTime.ElapsedGameTime.TotalMilliseconds * SPRITE_MOVE_PIXELS_PER_MS * scale);
                m_rectSessler.Y = Math.Max(m_rectSessler.Y - moveDistance, 0);
            }
        }

        private void onMoveDown(GameTime gameTime, float scale)
        {
            if ((m_rectSessler.Bottom - m_rectSessler.Height / 2) < this.m_graphics.GraphicsDevice.Viewport.Height)
            {
                int moveDistance = (int)(gameTime.ElapsedGameTime.TotalMilliseconds * SPRITE_MOVE_PIXELS_PER_MS * scale);
                m_rectSessler.Y = Math.Min(m_rectSessler.Y + moveDistance, this.m_graphics.GraphicsDevice.Viewport.Height);
            }
        }

        private void onMoveLeft(GameTime gameTime, float scale)
        {
            if ((m_rectSessler.Left - m_rectSessler.Width / 2) > 0)
            {
                int moveDistance = (int)(gameTime.ElapsedGameTime.TotalMilliseconds * SPRITE_MOVE_PIXELS_PER_MS * scale);
                m_rectSessler.X = Math.Max(m_rectSessler.X - moveDistance, 0);
            }
        }

        private void onMoveRight(GameTime gameTime, float scale)
        {
            if ((m_rectSessler.Right - m_rectSessler.Width / 2) < this.m_graphics.GraphicsDevice.Viewport.Width)
            {
                int moveDistance = (int)(gameTime.ElapsedGameTime.TotalMilliseconds * SPRITE_MOVE_PIXELS_PER_MS * scale);
                m_rectSessler.X = Math.Min(m_rectSessler.X + moveDistance, this.m_graphics.GraphicsDevice.Viewport.Width);
            }
        }

        private void onRotateLeft(GameTime gameTime, float scale)
        {
            float rotateDistance = (float)(gameTime.ElapsedGameTime.TotalMilliseconds * SPRITE_ROTATE_RADIANS_PER_MS * scale);
            m_rotationSessler -= rotateDistance;
        }

        private void onRotateRight(GameTime gameTime, float scale)
        {
            float rotateDistance = (float)(gameTime.ElapsedGameTime.TotalMilliseconds * SPRITE_ROTATE_RADIANS_PER_MS * scale);
            m_rotationSessler += rotateDistance;
        }

        #endregion
    }
}
