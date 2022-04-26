using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using System;

namespace CS5410
{
    public class InputKeyboard2 : Game
    {
        private GraphicsDeviceManager m_graphics;
        private SpriteBatch m_spriteBatch;

        private Texture2D m_texSessler;
        private Rectangle m_rectSessler = new Rectangle(200, 200, 400, 400);
        private float m_rotationSessler = 0;
        private const float SPRITE_MOVE_PIXELS_PER_MS = 300.0f / 1000.0f;
        private const float SPRITE_ROTATE_RADIANS_PER_MS = (MathHelper.Pi / 2) / 1000.0f;   // 4 seconds for full rotation

        public InputKeyboard2()
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

            int moveDistance = (int)(gameTime.ElapsedGameTime.TotalMilliseconds * SPRITE_MOVE_PIXELS_PER_MS);
            float rotateDistance = (float)(gameTime.ElapsedGameTime.TotalMilliseconds * SPRITE_ROTATE_RADIANS_PER_MS);
            //
            // Handle keyboard movement
            foreach (Keys key in Keyboard.GetState().GetPressedKeys())
            {
                moveOnKey(key, moveDistance, rotateDistance);
            }

            //
            // Handle controller movement
            if (GamePad.GetState(PlayerIndex.One).Buttons.A == ButtonState.Pressed)
            {
                moveDown(moveDistance);
            }
            if (GamePad.GetState(PlayerIndex.One).Buttons.B == ButtonState.Pressed)
            {
                moveRight(moveDistance);
            }
            if (GamePad.GetState(PlayerIndex.One).Buttons.Y == ButtonState.Pressed)
            {
                moveUp(moveDistance);
            }
            if (GamePad.GetState(PlayerIndex.One).Buttons.X == ButtonState.Pressed)
            {
                moveLeft(moveDistance);
            }

            if (GamePad.GetState(PlayerIndex.One).ThumbSticks.Left.X > 0)
            {
                moveRight((int)(moveDistance * GamePad.GetState(PlayerIndex.One).ThumbSticks.Left.X));
            }
            if (GamePad.GetState(PlayerIndex.One).ThumbSticks.Left.X < 0)
            {
                moveLeft((int)(moveDistance * Math.Abs(GamePad.GetState(PlayerIndex.One).ThumbSticks.Left.X)));
            }
            if (GamePad.GetState(PlayerIndex.One).ThumbSticks.Left.Y > 0)
            {
                moveUp((int)(moveDistance * GamePad.GetState(PlayerIndex.One).ThumbSticks.Left.Y));
            }
            if (GamePad.GetState(PlayerIndex.One).ThumbSticks.Left.Y < 0)
            {
                moveDown((int)(moveDistance * Math.Abs(GamePad.GetState(PlayerIndex.One).ThumbSticks.Left.Y)));
            }

            if (GamePad.GetState(PlayerIndex.One).ThumbSticks.Right.X > 0)
            {
                rotateRight(rotateDistance * GamePad.GetState(PlayerIndex.One).ThumbSticks.Right.X);
            }
            if (GamePad.GetState(PlayerIndex.One).ThumbSticks.Right.X < 0)
            {
                rotateLeft(rotateDistance * Math.Abs(GamePad.GetState(PlayerIndex.One).ThumbSticks.Right.X));
            }

            base.Update(gameTime);
        }

        private void moveOnKey(Keys key, int moveDistance, float rotateDistance)
        {
            switch (key)
            {
                case Keys.W:
                case Keys.Up:
                    moveUp(moveDistance);
                    break;
                case Keys.A:
                case Keys.Left:
                    moveLeft(moveDistance);
                    break;
                case Keys.S:
                case Keys.Down:
                    moveDown(moveDistance);
                    break;
                case Keys.D:
                case Keys.Right:
                    moveRight(moveDistance);
                    break;
                case Keys.Q:
                    rotateLeft(rotateDistance);
                    break;
                case Keys.E:
                    rotateRight(rotateDistance);
                    break;
            }
        }

        /// <summary>
        /// The various moveX methods subtract half of the height/width because the rendering is performed
        /// from the center of the rectangle because it can rotate
        /// </summary>
        private void moveUp(int moveDistance)
        {
            if (m_rectSessler.Y > m_rectSessler.Height / 2)
            {
                m_rectSessler.Y = Math.Max(m_rectSessler.Y - moveDistance, 0);
            }
        }

        private void moveDown(int moveDistance)
        {
            if ((m_rectSessler.Bottom - m_rectSessler.Height / 2) < this.m_graphics.GraphicsDevice.Viewport.Height)
            {
                m_rectSessler.Y = Math.Min(m_rectSessler.Y + moveDistance, this.m_graphics.GraphicsDevice.Viewport.Height);
            }
        }

        private void moveLeft(int moveDistance)
        {
            if ((m_rectSessler.Left - m_rectSessler.Width / 2) > 0)
            {
                m_rectSessler.X = Math.Max(m_rectSessler.X - moveDistance, 0);
            }
        }

        private void moveRight(int moveDistance)
        {
            if ((m_rectSessler.Right - m_rectSessler.Width / 2) < this.m_graphics.GraphicsDevice.Viewport.Width)
            {
                m_rectSessler.X = Math.Min(m_rectSessler.X + moveDistance, this.m_graphics.GraphicsDevice.Viewport.Width);
            }
        }

        private void rotateLeft(float rotateDistance)
        {
            m_rotationSessler -= rotateDistance;
        }

        private void rotateRight(float rotateDistance)
        {
            m_rotationSessler += rotateDistance;
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
    }
}
