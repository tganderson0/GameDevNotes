using CS5410.Particles;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using System;

namespace CS5410
{
    public class ParticlesStep4 : Game
    {
        private GraphicsDeviceManager m_graphics;
        private SpriteBatch m_spriteBatch;

        private ParticleEmitter m_emitter1;
        private ParticleEmitter m_emitter2;

        private ParticleEmitter m_emitter3;

        public ParticlesStep4()
        {
            m_graphics = new GraphicsDeviceManager(this);
            Content.RootDirectory = "Content";
        }

        /// <summary>
        /// Allows the game to perform any initialization it needs to before starting to run.
        /// This is where it can query for any required services and load any non-graphic
        /// related content.  Calling base.Initialize will enumerate through any components
        /// and initialize them as well.
        /// </summary>
        protected override void Initialize()
        {
            m_graphics.PreferredBackBufferWidth = 1920;
            m_graphics.PreferredBackBufferHeight = 1080;

            m_graphics.ApplyChanges();

            base.Initialize();
        }

        /// <summary>
        /// LoadContent will be called once per game and is the place to load
        /// all of your content.
        /// </summary>
        protected override void LoadContent()
        {
            // Create a new SpriteBatch, which can be used to draw textures.
            m_spriteBatch = new SpriteBatch(GraphicsDevice);

            int middleX = m_graphics.GraphicsDevice.Viewport.Width / 2;
            int middleY = m_graphics.GraphicsDevice.Viewport.Height / 2;
            m_emitter1 = new ParticleEmitter(
                Content,
                new TimeSpan(0, 0, 0, 0, 5),
                middleX, middleY,
                20,
                2,
                new TimeSpan(0, 0, 4),
                new TimeSpan(0, 0, 0, 0, 3000));

            m_emitter2 = new ParticleEmitter(
                Content,
                new TimeSpan(0, 0, 0, 0, 25),
                middleX, middleY,
                40,
                1,
                new TimeSpan(0, 0, 6),
                new TimeSpan(0, 0, 0, 0, 5000));

            m_emitter3 = new ParticleEmitter(
                Content,
                new TimeSpan(0, 0, 0, 0, 10),
                middleX, middleY,
                8,
                4,
                new TimeSpan(0, 0, 4),
                new TimeSpan(0, 0, 0));
        }

        /// <summary>
        /// UnloadContent will be called once per game and is the place to unload
        /// all content.
        /// </summary>
        protected override void UnloadContent()
        {
            // TODO: Unload any non ContentManager content here

        }

        /// <summary>
        /// Allows the game to run logic such as updating the world,
        /// checking for collisions, gathering input, and playing audio.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Update(GameTime gameTime)
        {
            // Allows the game to exit
            if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed)
                this.Exit();
            if (Keyboard.GetState().IsKeyDown(Keys.Escape))
            {
                this.Exit();
            }

            m_emitter1.update(gameTime);
            m_emitter2.update(gameTime);
            m_emitter3.update(gameTime);

            //
            // Check the left thumbstick for movement and let's set the gravity based upon that
            GamePadState State = GamePad.GetState(PlayerIndex.One);
            m_emitter1.Gravity = new Vector2(State.ThumbSticks.Left.X * 0.02f, -State.ThumbSticks.Left.Y * 0.02f);
            m_emitter2.Gravity = new Vector2(State.ThumbSticks.Left.X * 0.02f, -State.ThumbSticks.Left.Y * 0.02f);
            m_emitter3.Gravity = new Vector2(State.ThumbSticks.Left.X * 0.02f, -State.ThumbSticks.Left.Y * 0.02f);


            base.Update(gameTime);
        }

        /// <summary>
        /// This is called when the game should draw itself.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(Color.Black);

            //
            // Render the particles
            m_spriteBatch.Begin(SpriteSortMode.BackToFront, BlendState.Additive);

            m_emitter1.draw(m_spriteBatch);
            m_emitter2.draw(m_spriteBatch);
            m_emitter3.draw(m_spriteBatch);


            m_spriteBatch.End();

            base.Draw(gameTime);
        }
    }
}
