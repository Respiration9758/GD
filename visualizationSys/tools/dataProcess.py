import pandas as pd
import numpy as np
import talib
def calculateMA(df, num):
    df["MA_" + str(num)] = df['close'].rolling(num).mean()

def calculateEMA(df, num):
    df["EMA" + str(num)] = talib.EMA(df['close'].values, timeperiod=num)


def calculateKDJ(df):
    df['KValue'], df['DValue'] = talib.STOCH(df['high'].values, df['low'].values, df['close'].values,
                                   fastk_period=9, slowk_period=3, slowk_matype=0, slowd_period=3, slowd_matype=0)
    df['JValue'] = df.KValue*3-df.DValue*2

def calculatePSY(df, period):
    # def getPSY(priceData, period):
        # rolling calculation of the PSY, psychological line
        # priceData should be the close price data, in np format
        # period is the length of days in which we look at how many days witness price increase
        priceData = df['close'].values
        difference = priceData[1:] - priceData[:-1]
        # price change
        #    difference = np.append(np.nan, difference)
        # to make the length of the difference same as the priceData, lag of one day
        # to avoid the warning, use 0 instead of np.nan, the result should be the same
        difference = np.append(0, difference)
        difference_dir = np.where(difference > 0, 1, 0)
        # get the direction of the price change, if increase, 1, else 0
        psy = np.zeros((len(df),))
        psy[:period] *= np.nan
        # there are two kind of lags here, the lag of the price change and the lag of the period
        for i in range(period, len(df)):
            psy[i] = (difference_dir[i - period + 1:i + 1].sum()) / period
            # definition of the psy: the number of the price increases to the total number of days
        df.insert(1, 'PSY', psy)

