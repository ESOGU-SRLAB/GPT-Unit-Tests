import unittest
import pandas as pd
import numpy as np

def create_and_sum_dataframe(rows, columns):
    # Create a DataFrame with specified rows and columns filled with random numbers
    df = pd.DataFrame(np.random.randint(0, 100, size=(rows, columns)), columns=[f'Column{i}' for i in range(columns)])

    # Sum the numbers in the DataFrame
    total_sum = df.sum().sum()  # This sums up all the values in the DataFrame

    return df, total_sum

class TestCreateAndSumDataframe(unittest.TestCase):
    def test_create_and_sum_dataframe(self):
        rows = 5
        columns = 3

        df, total_sum = create_and_sum_dataframe(rows, columns)

        # Check if the DataFrame has the correct shape (rows x columns)
        self.assertEqual(df.shape, (rows, columns))

if __name__ == '__main__':
    unittest.main()