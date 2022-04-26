
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CS5410
{
    public class GameModel
    {
        private Player m_player = new Player();
        private Centipede m_centipede = new Centipede();
        // private List<Bullet> m_bullets = new ...

        private KeyboardInput m_input = new KeyboardInput();

        public Player Player
        {
            get { return m_player; }
        }

        public Centipede Centipede
        {
            get { return m_centipede; }
        }

        public void initialize()
        {
            // Read the controls from persistence
            m_input.registerHandle(Keys.Left, moveLeft);
        }

        private void moveLeft()
        {
            // Move player left
        }

        public void processInput(GameTime gameTime)
        {
            m_input.update(gameTime);
        }

        public void update(GameTime gameTime)
        {
            m_player.update(gameTime);
            m_centipede.update(gameTime);

            updateBullets();
        }

        private void updateBullets()
        {
            //foreach (var bullet in m_bullets)
            //{
            //    ...
            //}
        }

    }
}