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

def calculatePSY(df):
    # period = 10
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
        psy[:10] *= np.nan
        # there are two kind of lags here, the lag of the price change and the lag of the period
        for i in range(10, len(df)):
            psy[i] = (difference_dir[i - 10 + 1:i + 1].sum()) / 10
            # definition of the psy: the number of the price increases to the total number of days
        df.insert(1, 'PSY', psy)

def calculateMACD(df):
    # 调用talib计算指数移动平均线的值
    df['EMA12'] = talib.EMA(df['close'].values, timeperiod=6)
    df['EMA26'] = talib.EMA(df['close'].values, timeperiod=12)
    # 调用talib计算MACD指标
    df['DIFF'], df['DEA'], df['MACD'] = talib.MACD(df['close'].values,
                                                              fastperiod=6, slowperiod=12, signalperiod=9)
def calculateRSI(df):
    df['RSI12'] = talib.RSI(df['close'].values, timeperiod=12)  # RSI的天数一般是6、12、24
    df['RSI6'] = talib.RSI(df['close'].values, timeperiod=6)
    df['RSI24'] = talib.RSI(df['close'].values, timeperiod=24)


def calculateMOM(df):
    df['MOM25'] = talib.MOM(df['close'].values, timeperiod=25)
    df["MOM25_MA_10"] = df['MOM25'].rolling(10).mean()

def calculateBBANDS(df):
    df['UPPER'], df['MID'], df['LOWER'] =talib.BBANDS(df['close'].values,matype=talib.MA_Type.T3)


def calculateOBV(df):
    df['OBV'] = talib.OBV(df['close'].values, df['volume'].values)

def calculateTRIX(df):
    df['TRIX12'] = talib.TRIX(df['close'].values, timeperiod=12)
    df['TRIX20'] = talib.TRIX(df['close'].values, timeperiod=20)
