import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import './App.scss';
import {
  ElectricityAmountBox,
  ElectricityAmountTextField,
  ElectricityBaseBox,
  ElectricityBaseTextField,
} from './layouts/electricity-field';
import { getDays } from './shared/calc-date';

type Inputs = {
  firstUnit: string;
  secondUnit: string;
  thirdUnit: string;
  baseUnit: string;
  monthlyMinUnit: string;
  saieneHatsuden: string;
  sumKwh: string;
  days: string;
  firstBaseKwh: string;
  secondBaseKwh: string;
};

function App() {
  const {
    register,
    handleSubmit,
    watch,
    // formState: { errors },
  } = useForm<Inputs>();
  const [monthlyFee, setMonthlyFee] = useState('0');
  const [yearlyFee, setYearlyFee] = useState('0');
  const [dailyFee, setDailyFee] = useState('0');
  // const watchAllFields = watch();

  const calcFee = (data: Inputs) => {
    const {
      firstUnit,
      secondUnit,
      thirdUnit,
      baseUnit,
      monthlyMinUnit,
      saieneHatsuden,
      sumKwh,
      days,
      firstBaseKwh,
      secondBaseKwh,
    } = data;

    let firstUnitNum = Number(firstUnit);
    const secondUnitNum = Number(secondUnit);
    const thirdUnitNum = Number(thirdUnit);
    const baseUnitNum = Number(baseUnit);
    const monthlyMinUnitNum = Number(monthlyMinUnit);
    const saieneHatsudenNum = Number(saieneHatsuden);
    const sumKwhNum = Number(sumKwh);
    const daysNum = Number(days);
    const firstBaseKwhNum = Number(firstBaseKwh);
    const secondBaseKwhNum = Number(secondBaseKwh);

    let thirdKwh = 0;
    if (sumKwhNum > secondBaseKwhNum) {
      thirdKwh = sumKwhNum - secondBaseKwhNum;
    }

    let secondKwh = sumKwhNum - thirdKwh - firstBaseKwhNum;
    if (secondKwh <= 0) {
      secondKwh = 0;
    }

    let firstKwh = firstBaseKwhNum - sumKwhNum;
    if (firstKwh <= 0) {
      firstKwh = firstBaseKwhNum;
    } else {
      firstKwh = sumKwhNum;
    }

    const baseFee =
      Math.round(firstKwh * firstUnitNum) +
      Math.round(secondKwh * secondUnitNum) +
      Math.round(thirdKwh * thirdUnitNum) +
      Math.round(baseUnitNum) +
      Math.round(monthlyMinUnitNum) +
      Math.round(sumKwhNum * saieneHatsudenNum);

    setMonthlyFee(baseFee.toLocaleString());
    setYearlyFee(Math.round(baseFee * 12).toLocaleString());
    setDailyFee(Math.round(baseFee / daysNum).toLocaleString());
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {};

  const setLocalStorage = (key: string, value: string | number | undefined) => {
    if (value) {
      localStorage.setItem(key, value.toString());
    }
  };

  const getLocalStorage = (key: string, defaultValue: string | null) => {
    let targetValue = localStorage.getItem(key);
    if (targetValue === null) {
      targetValue = defaultValue;
    }
    return targetValue;
  };

  const [firstUnit] = useState(getLocalStorage('firstUnit', '19.52'));
  const [secondUnit] = useState(getLocalStorage('secondUnit', '26.48'));
  const [thirdUnit] = useState(getLocalStorage('thirdUnit', '30.57'));
  const [baseUnit] = useState(getLocalStorage('baseUnit', '858'));
  const [monthlyMinUnit] = useState(
    getLocalStorage('monthlyMinUnit', '235.84')
  );
  const [saieneHatsuden] = useState(getLocalStorage('saieneHatsuden', '3.5'));
  const [sumKwh] = useState('0');
  const [days] = useState(getLocalStorage('days', getDays().toLocaleString()));
  const [firstBaseKwh] = useState(getLocalStorage('firstBaseKwh', '120'));
  const [secondBaseKwh] = useState(getLocalStorage('secondBaseKwh', '300'));

  // useEffect(() => {
  //   const kwh = getLocalStorage('sumKwh', '0');
  //   if (kwh) {
  //     setSumKwh(kwh);
  //   }
  // }, []);

  useEffect(() => {
    const sub = watch((value, { name, type }) => {
      console.log(value, name, type);
      calcFee(value as Inputs);
      const {
        firstUnit,
        secondUnit,
        thirdUnit,
        baseUnit,
        monthlyMinUnit,
        saieneHatsuden,
        sumKwh,
        days,
        firstBaseKwh,
        secondBaseKwh,
      } = value;

      setLocalStorage('firstUnit', firstUnit);
      setLocalStorage('secondUnit', secondUnit);
      setLocalStorage('thirdUnit', thirdUnit);
      setLocalStorage('baseUnit', baseUnit);
      setLocalStorage('monthlyMinUnit', monthlyMinUnit);
      setLocalStorage('saieneHatsuden', saieneHatsuden);
      setLocalStorage('sumKwh', sumKwh);
      setLocalStorage('days', days);
      setLocalStorage('firstBaseKwh', firstBaseKwh);
      setLocalStorage('secondBaseKwh', secondBaseKwh);
    });
    return () => sub.unsubscribe();
  }, [watch]);

  return (
    <div className="App">
      <Box>
        <h3>電気料金計算ツール(仮)</h3>
        <a
          target="_blank noopener noreferrer"
          href="https://twitter.com/rinne_grid"
        >
          @rinne_grid
        </a>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ElectricityAmountBox>
            <ElectricityAmountTextField
              type="number"
              label="電気利用量(Kwh)"
              defaultValue={sumKwh}
              {...register('sumKwh')}
            />
          </ElectricityAmountBox>
          <Card sx={{ fontSize: '2rem', textAlign: 'center' }}>
            {monthlyFee !== '0' && (
              <div>
                月額:{' '}
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  ￥{monthlyFee}
                </span>
              </div>
            )}
            {yearlyFee !== '0' && (
              <div>
                年間:{' '}
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  ￥{yearlyFee}
                </span>
              </div>
            )}
            {dailyFee !== '0' && (
              <div>
                1日あたり:{' '}
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  ￥{dailyFee}
                </span>
              </div>
            )}
          </Card>
          <Box sx={{ display: 'flex', justifyContents: 'flex-start' }}>
            <ElectricityBaseBox>
              <ElectricityBaseTextField
                type="number"
                label="第1段階料金"
                variant="outlined"
                defaultValue={firstUnit}
                {...register('firstUnit')}
              />

              <ElectricityBaseTextField
                type="number"
                label="第2段階料金"
                variant="outlined"
                defaultValue={secondUnit}
                {...register('secondUnit')}
              />

              <ElectricityBaseTextField
                type="number"
                label="第3段階料金"
                defaultValue={thirdUnit}
                {...register('thirdUnit')}
              />
              <ElectricityBaseTextField
                type="number"
                label="再エネ発電料金"
                defaultValue={saieneHatsuden}
                {...register('saieneHatsuden')}
              />

              <ElectricityBaseTextField
                type="number"
                label="基本料金"
                defaultValue={baseUnit}
                {...register('baseUnit')}
              />

              <ElectricityBaseTextField
                type="number"
                label="最低月額料金"
                defaultValue={monthlyMinUnit}
                {...register('monthlyMinUnit')}
              />
              <ElectricityBaseTextField
                type="number"
                label="日数"
                defaultValue={days}
                {...register('days')}
              />
            </ElectricityBaseBox>
            <ElectricityBaseBox>
              <ElectricityBaseTextField
                type="number"
                label="第1段階計算基準Kwh"
                defaultValue={firstBaseKwh}
                {...register('firstBaseKwh')}
              />
              <ElectricityBaseTextField
                type="number"
                label="第2段階計算基準Kwh"
                defaultValue={secondBaseKwh}
                {...register('secondBaseKwh')}
              />
            </ElectricityBaseBox>
          </Box>
        </form>
      </Box>
    </div>
  );
}

export default App;
