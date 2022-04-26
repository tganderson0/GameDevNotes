using System;

namespace Random
{
    /// <summary>
    /// Based on code found at: https://codingha.us/2018/12/17/xorshift-fast-csharp-random-number-generator/
    /// </summary>
    public class RandomXorShift
    {
        private ulong x;
        private ulong y;

        public RandomXorShift()
        {
            this.x = (ulong)Guid.NewGuid().GetHashCode();
            this.y = (ulong)Guid.NewGuid().GetHashCode();
        }

        public ulong next()
        {
            ulong localX = y;
            x ^= x << 23;
            ulong localY = x ^ y ^ (x >> 17) ^ (y >> 26);

            ulong result = localY + y;
            x = localX;
            y = localY;

            return result;
        }

        public double nextDouble()
        {
            ulong localX = y;
            x ^= x << 23;
            ulong localY = x ^ y ^ (x >> 17) ^ (y >> 26);
            ulong localZ = localY + y;

            double result = (1.0 / (int.MaxValue + 1.0)) * (0x7FFFFFFF & localZ);
            x = localX;
            y = localY;

            return result;
        }
    }
}
