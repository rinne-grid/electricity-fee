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

  useEffect(() => {
    const sub = watch((value, { name, type }) => {
      console.log(value, name, type);
      calcFee(value as Inputs);
    });
    return () => sub.unsubscribe();
  }, [watch]);

  return (
    <div className="App">
      <Box>
        <h3>???????????????????????????(???)</h3>
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
              label="???????????????(Kwh)"
              defaultValue={0}
              {...register('sumKwh')}
            />
          </ElectricityAmountBox>
          <Card sx={{ fontSize: '2rem', textAlign: 'center' }}>
            {monthlyFee !== '0' && (
              <div>
                ??????:{' '}
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  ???{monthlyFee}
                </span>
              </div>
            )}
            {yearlyFee !== '0' && (
              <div>
                ??????:{' '}
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  ???{yearlyFee}
                </span>
              </div>
            )}
            {dailyFee !== '0' && (
              <div>
                1????????????:{' '}
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  ???{dailyFee}
                </span>
              </div>
            )}
          </Card>
          <Box sx={{ display: 'flex', justifyContents: 'flex-start' }}>
            <ElectricityBaseBox>
              <ElectricityBaseTextField
                type="number"
                label="???1????????????"
                variant="outlined"
                defaultValue={19.52}
                {...register('firstUnit')}
              />

              <ElectricityBaseTextField
                type="number"
                label="???2????????????"
                variant="outlined"
                defaultValue={26.48}
                {...register('secondUnit')}
              />

              <ElectricityBaseTextField
                type="number"
                label="???3????????????"
                defaultValue={30.57}
                {...register('thirdUnit')}
              />
              <ElectricityBaseTextField
                type="number"
                label="?????????????????????"
                defaultValue={3.5}
                {...register('saieneHatsuden')}
              />

              <ElectricityBaseTextField
                type="number"
                label="????????????"
                defaultValue={858}
                {...register('baseUnit')}
              />

              <ElectricityBaseTextField
                type="number"
                label="??????????????????"
                defaultValue={235.84}
                {...register('monthlyMinUnit')}
              />
              <ElectricityBaseTextField
                type="number"
                label="??????"
                defaultValue={getDays()}
                {...register('days')}
              />
            </ElectricityBaseBox>
            <ElectricityBaseBox>
              <ElectricityBaseTextField
                type="number"
                label="???1??????????????????Kwh"
                defaultValue={120}
                {...register('firstBaseKwh')}
              />
              <ElectricityBaseTextField
                type="number"
                label="???2??????????????????Kwh"
                defaultValue={300}
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
