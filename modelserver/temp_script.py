import unittest
import numpy as np

def count_below_average(lst):
    if not lst:
        return 0

    arr = np.array(lst)
    average = np.mean(arr)
    below_average = arr[arr < average]

    return len(below_average)

class TestCountBelowAverage(unittest.TestCase):

    def test_empty_list(self):
        self.assertEqual(count_below_average([]), 0)

    def test_all_elements_above_avg(self):
        self.assertEqual(count_below_average([10, 20, 30]), 0)

    def test_some_elements_below_avg(self):
        self.assertEqual(count_below_average([1,2,3,4]), 2)


if __name__ == '__main__':
	unittest.main()