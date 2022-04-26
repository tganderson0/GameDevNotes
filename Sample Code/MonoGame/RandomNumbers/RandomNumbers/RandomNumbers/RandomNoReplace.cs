using System.Collections.Generic;
using System.Linq;

namespace Random
{
    public class RandomNoReplace
    {
        List<int> bagOfNumbers;
        List<int> original;

        public void setDistribution(List<KeyValuePair<int, int>> dist)
        {
            List<int> values = new List<int>();
            foreach (var pair in dist)
            {
                for (int count = 1; count <= pair.Value; count++)
                {
                    values.Add(pair.Key);
                }
            }

            bagOfNumbers = shuffle(values);
        }

        public int next()
        {
            if (bagOfNumbers.Count == 0)
            {
                bagOfNumbers = shuffle(original);
            }

            int value = bagOfNumbers.Last<int>();
            bagOfNumbers.RemoveAt(bagOfNumbers.Count - 1);

            return value;
        }


        private List<int> shuffle(List<int> a)
        {
            // Making a copy when need to start the distribution over
            original = a.Select(item => item).ToList();

            RandomMT rnd = new RandomMT();
            for (int i = 0; i < a.Count; i++)
            {
                int position = (int)(rnd.nextDouble() * a.Count);
                int temp = a[position];
                a[position] = a[i];
                a[i] = temp;
            }

            return a;
        }
    }
}
