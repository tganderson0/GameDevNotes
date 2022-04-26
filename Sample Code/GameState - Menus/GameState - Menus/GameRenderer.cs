using Microsoft.Xna.Framework.Graphics;

namespace CS5410
{
    public class GameRenderer
    {
        public void render(SpriteBatch spriteBatch, GameModel model)
        {
            spriteBatch.Begin();

            // Render the player
            renderPlayer(spriteBatch, model.Player);

            spriteBatch.End();
        }

        private void renderPlayer(SpriteBatch spriteBatch, Player player)
        {

        }
    }

}