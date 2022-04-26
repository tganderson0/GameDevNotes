namespace Random
{
    public class RandomLCG
    {
        // Following C++ 11: m = 2^32 - 1, a = 48271, c = 0
        private long m = 4294967295;
        private long a = 47271;
        private long c = 0;
        private long z = 3;

        // Use these to demonstrate the period
        // private long m = 25;
        // private long a = 11;
        // private long c = 17;
        public RandomLCG(long seed = 3)
        {
            this.z = seed;
        }

        public long next()
        {
            z = (a * z + c) % m;
            return z;
        }

        public double nextDouble()
        {
            return next() / (double)m;
        }
    }
}
