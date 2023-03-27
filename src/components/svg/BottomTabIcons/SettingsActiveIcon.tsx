import React from 'react';
import { Path, Svg } from 'react-native-svg';

export const SettingsActiveIcon = () => {
  return (
    <Svg width="22" height="22" viewBox="0 0 24 25" fill="none">
      <Path
        d="M12 8.00006C9.51472 8.00006 7.5 10.0148 7.5 12.5001C7.5 14.9853 9.51472 17.0001 12 17.0001C13.3488 17.0001 14.559 16.4066 15.3838 15.4666C16.0787 14.6746 16.5 13.6365 16.5 12.5001C16.5 12.0401 16.431 11.5963 16.3028 11.1784C15.7382 9.33807 14.0253 8.00006 12 8.00006ZM9 12.5001C9 10.8432 10.3431 9.50006 12 9.50006C13.6569 9.50006 15 10.8432 15 12.5001C15 14.1569 13.6569 15.5001 12 15.5001C10.3431 15.5001 9 14.1569 9 12.5001ZM19.7093 20.8948L17.9818 20.1364C17.4876 19.9197 16.9071 19.9515 16.44 20.2219C15.9729 20.4924 15.675 20.9693 15.6157 21.5066L15.408 23.3855C15.3651 23.773 15.084 24.0917 14.7055 24.182C12.9263 24.6061 11.0725 24.6061 9.29326 24.182C8.91476 24.0917 8.63363 23.773 8.59081 23.3855L8.38343 21.5093C8.32251 20.9731 8.0112 20.4976 7.54452 20.2281C7.07783 19.9586 6.51117 19.9269 6.01859 20.1424L4.29071 20.9009C3.93281 21.058 3.51493 20.9718 3.24806 20.6859C2.00474 19.3536 1.07924 17.7561 0.541215 16.0137C0.425331 15.6384 0.559224 15.2307 0.8749 14.9977L2.40219 13.8703C2.83721 13.5501 3.09414 13.0415 3.09414 12.5007C3.09414 11.9598 2.83721 11.4512 2.40162 11.1306L0.875288 10.0051C0.559144 9.77202 0.425127 9.36382 0.54142 8.98819C1.08038 7.24734 2.00637 5.65163 3.24971 4.32114C3.51684 4.03528 3.93492 3.94941 4.29276 4.10691L6.01296 4.86404C6.50793 5.08168 7.07696 5.04881 7.54617 4.77415C8.01335 4.50264 8.32437 4.02527 8.38442 3.48794L8.59334 1.61017C8.63697 1.21803 8.92453 0.897035 9.30894 0.811375C10.19 0.61504 11.0891 0.510712 12.0131 0.500061C12.9147 0.510473 13.8128 0.614846 14.6928 0.811493C15.077 0.897336 15.3643 1.21823 15.4079 1.61017L15.617 3.48937C15.7116 4.35221 16.4387 5.00572 17.3055 5.00663C17.5385 5.007 17.769 4.95838 17.9843 4.86294L19.7048 4.10568C20.0626 3.94818 20.4807 4.03405 20.7478 4.31991C21.9912 5.6504 22.9172 7.24611 23.4561 8.98695C23.5723 9.36234 23.4386 9.77028 23.1228 10.0035L21.5978 11.1297C21.1628 11.45 20.9 11.9586 20.9 12.4994C20.9 13.0403 21.1628 13.5489 21.5988 13.8698L23.1251 14.9965C23.441 15.2296 23.5748 15.6376 23.4586 16.0131C22.9198 17.7536 21.9944 19.3492 20.7517 20.6799C20.4849 20.9657 20.0671 21.0518 19.7093 20.8948ZM14.263 20.6966C14.4982 19.9685 14.9889 19.3288 15.6884 18.9238C16.5702 18.4132 17.6536 18.3547 18.5841 18.7627L19.9281 19.3526C20.791 18.3538 21.4593 17.2013 21.8981 15.9552L20.7095 15.0778L20.7086 15.0771C19.898 14.48 19.4 13.5277 19.4 12.4994C19.4 11.4719 19.8974 10.5195 20.7073 9.92272L20.7085 9.92176L21.8957 9.04502C21.4567 7.7988 20.7881 6.64636 19.9248 5.6477L18.5922 6.23425L18.5899 6.23527C18.1844 6.41463 17.7472 6.50722 17.3039 6.50663C15.6715 6.50453 14.3046 5.27431 14.1261 3.65465L14.1259 3.65291L13.9635 2.19304C13.3202 2.07328 12.6677 2.00872 12.013 2.00017C11.3389 2.00891 10.6821 2.07367 10.0377 2.19328L9.87514 3.65452C9.76248 4.66272 9.17931 5.55909 8.30191 6.06986C7.41937 6.5856 6.34453 6.64844 5.40869 6.23694L4.07273 5.64893C3.20949 6.64751 2.54092 7.79983 2.10196 9.04593L3.29181 9.92326C4.11115 10.5269 4.59414 11.4837 4.59414 12.5007C4.59414 13.5173 4.11142 14.4742 3.29237 15.0776L2.10161 15.9566C2.54002 17.2044 3.2085 18.3585 4.07205 19.3587L5.41742 18.7682C6.34745 18.3613 7.41573 18.4215 8.29471 18.9292C9.17398 19.437 9.75934 20.332 9.87384 21.34L9.87435 21.3445L10.0362 22.8088C11.3326 23.0638 12.6662 23.0638 13.9626 22.8088L14.1247 21.3418C14.1491 21.1217 14.1955 20.9055 14.263 20.6966Z"
        fill="#2F2B43"
        fill-opacity="0.7"
      />
    </Svg>
  );
};
