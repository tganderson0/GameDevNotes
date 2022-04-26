using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace CS5410
{
    public class GamePlayView : GameStateView
    {
        private SpriteFont m_font;
        private const string MESSAGE = "Isn't this game fun!";

        private GameModel m_model = new GameModel();
        private GameRenderer m_renderer = new GameRenderer();

        public override void loadContent(ContentManager contentManager)
        {
            m_font = contentManager.Load<SpriteFont>("Fonts/menu");
        }

        public override GameStateEnum processInput(GameTime gameTime)
        {
            if (Keyboard.GetState().IsKeyDown(Keys.Escape))
            {
                // Should probably ask the player if they really want to quit the game and return to main menu
                return GameStateEnum.MainMenu;
            }

            m_model.processInput(gameTime);

            return GameStateEnum.GamePlay;
        }

        public override void update(GameTime gameTime)
        {
            m_model.update(gameTime);
        }

        public override void render(GameTime gameTime)
        {
            //m_spriteBatch.Begin();

            //Vector2 stringSize = m_font.MeasureString(MESSAGE);
            //m_spriteBatch.DrawString(m_font, MESSAGE,
            //    new Vector2(m_graphics.PreferredBackBufferWidth / 2 - stringSize.X / 2, m_graphics.PreferredBackBufferHeight / 2 - stringSize.Y), Color.Yellow);

            //m_centipede.render();

            //m_spriteBatch.End();

            m_renderer.render(m_spriteBatch, m_model);

        }

    }
}
