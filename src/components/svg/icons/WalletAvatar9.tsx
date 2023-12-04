import React from 'react';
import { Defs, Path, Svg, ClipPath, G } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function WalletAvatar9(props: Omit<IconProps, 'color'>) {
  const { scale = 1 } = props;
  const width = 128;
  const height = 128;
  return (
    <Svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <G clipPath="url(#prefix__clip0_1387_133)">
        <Path fill="#E6E6E6" d="M0 .956h126.694v128.478H0z" />
        <Path
          d="M34.647 37.782c13.824-23.318 47.574-23.318 61.398 0L121.88 81.36l24.822 44.163c13.282 23.631-3.593 52.859-30.699 53.172l-50.657.585-50.658-.585c-27.106-.313-43.98-29.541-30.699-53.172L8.813 81.36l25.835-43.578z"
          fill="#676B73"
          stroke="#191919"
          strokeWidth={5.353}
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M195.065 45.001a11.506 11.506 0 01-14.448-2.044l-24.978-27.172c-8.321-9.052-23.131-.498-19.449 11.233l5.215 16.611c1.899 6.048-1.452 12.493-7.493 14.412l-49.89 15.853c-10.709 3.403-10.691 18.562.025 21.94l17.086 5.386c6.768 2.133 10.011 9.825 6.813 16.159l-18.777 37.193c-4.803 9.513 4.791 19.88 14.647 15.827l61.623-25.34a11.507 11.507 0 018.931.075l54.838 23.643c9.855 4.249 19.646-6.113 14.847-15.712l-30.074-60.147a11.507 11.507 0 01.416-11.05l21.831-36.518c6.159-10.304-5.596-21.972-15.854-15.736l-25.309 15.387zm-.901 46.94a10.742 10.742 0 002.423-6.796c0-5.933-4.81-10.743-10.743-10.743H166.16c-6.355 0-11.506 5.151-11.506 11.506v27.862a9.463 9.463 0 0016.791 5.986l22.719-27.815z"
          fill="#159F80"
        />
        <Path
          d="M166.16 74.402v2.676-2.676zm28.004 17.539l2.073 1.693-2.073-1.693zm26.21-62.327l-1.39-2.287 1.39 2.287zm-5.977 52.254l2.297 1.374-2.297-1.374zm29.658 71.197l-2.394 1.197 2.394-1.197zm-78.616-8.006l1.018 2.475-1.018-2.475zm-61.623 25.34l1.018 2.475-1.018-2.475zM84.022 73.894l-.811-2.55.81 2.55zm.025 21.94l-.805 2.553.805-2.553zm57.358-52.205l2.554-.801-2.554.801zm-7.493 14.412l-.811-2.55.811 2.55zm21.727-42.256l-1.97 1.811 1.97-1.81zM136.19 27.018l-2.553.802 2.553-.802zm44.427 15.939l-1.971 1.811 1.971-1.811zm1.97-1.812L157.61 13.974l-3.941 3.622 24.977 27.172 3.941-3.623zm-48.95-13.325l5.214 16.611 5.108-1.603-5.215-16.612-5.107 1.604zm-.536 27.67l-49.89 15.853 1.621 5.102 49.89-15.853-1.621-5.102zM83.242 98.387l17.087 5.386 1.609-5.106-17.086-5.386-1.61 5.106zm22.314 17.786l-18.777 37.193 4.78 2.412 18.776-37.192-4.779-2.413zm-.722 56.701l61.623-25.34-2.036-4.951-61.623 25.34 2.036 4.951zm68.476-25.282l54.839 23.643 2.119-4.916-54.838-23.642-2.12 4.915zm73.139 4.276l-30.074-60.147-4.788 2.394 30.074 60.147 4.788-2.394zM233.93 43.976l-21.831 36.52 4.595 2.746 21.831-36.519-4.595-2.747zm-37.475 3.313l25.31-15.388-2.781-4.574-25.31 15.387 2.781 4.575zm-30.295 29.79h19.684v-5.354H166.16v5.353zm-8.829 36.691V85.908h-5.354v27.862h5.354zm34.76-23.522l-22.719 27.815 4.146 3.386 22.719-27.815-4.146-3.386zm-27.974 35.662c3.644 0 7.096-1.638 9.401-4.461l-4.146-3.386a6.783 6.783 0 01-5.255 2.493v5.354zm-12.14-12.14c0 6.705 5.435 12.14 12.14 12.14v-5.354a6.786 6.786 0 01-6.786-6.786h-5.354zm14.183-42.045c-7.833 0-14.183 6.35-14.183 14.183h5.354a8.83 8.83 0 018.829-8.83v-5.353zm33.103 13.42c0-7.412-6.008-13.42-13.419-13.42v5.353a8.066 8.066 0 018.066 8.067h5.353zm-5.353 0c0 1.86-.643 3.662-1.819 5.103l4.146 3.386a13.42 13.42 0 003.026-8.49h-5.353zm44.615-38.422c7.592-12.7-6.898-27.083-19.541-19.396l2.781 4.574c7.871-4.785 16.892 4.168 12.165 12.075l4.595 2.747zm-22.15 44.998a8.832 8.832 0 01.319-8.48l-4.595-2.746a14.182 14.182 0 00-.512 13.62l4.788-2.394zm11.774 79.514c12.146 5.237 24.216-7.536 18.3-19.367l-4.788 2.394c3.683 7.366-3.831 15.317-11.393 12.057l-2.119 4.916zm-61.692-23.701a8.831 8.831 0 016.853.058l2.12-4.915a14.182 14.182 0 00-11.009-.094l2.036 4.951zm-79.678 5.832c-5.92 11.726 5.907 24.504 18.055 19.508l-2.036-4.951c-7.563 3.111-14.925-4.845-11.24-12.145l-4.779-2.412zm13.55-49.593c5.193 1.637 7.681 7.539 5.227 12.4l4.779 2.413c3.942-7.809-.055-17.289-8.397-19.919l-1.609 5.106zm-17.118-32.43c-13.2 4.195-13.178 22.88.031 27.044l1.61-5.106c-8.224-2.592-8.237-14.225-.02-16.836l-1.621-5.102zm55.64-26.912a8.83 8.83 0 01-5.75 11.06l1.621 5.101c7.447-2.366 11.577-10.31 9.237-17.764l-5.108 1.603zm18.759-30.457c-10.257-11.158-28.512-.614-23.973 13.846l5.107-1.604c-2.826-9.001 8.54-15.566 14.925-8.62l3.941-3.622zm21.036 30.794a14.182 14.182 0 0017.809 2.52l-2.781-4.574a8.83 8.83 0 01-11.087-1.569l-3.941 3.623z"
          fill="#191919"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M35.015 88.276c0-4.033 4.067-6.795 7.815-5.308l46.932 18.612c9.845 3.904 19.091-6.802 13.796-15.974L78.912 42.92c-3.086-5.345-9.92-7.176-15.264-4.09L37.242 54.074A11.174 11.174 0 0123.9 52.443L3.867 33.133c-5.951-5.735-15.855-3.248-18.39 4.62l-23.003 71.416c-2.016 6.258 2.65 12.664 9.225 12.664 5.353 0 9.692 4.339 9.692 9.692v7.301c0 6.172 5.003 11.174 11.174 11.174H71.58c6.171 0 11.174-5.002 11.174-11.174v-20.212c0-4.587-2.804-8.708-7.07-10.393L38.628 93.588a5.71 5.71 0 01-3.613-5.312z"
          fill="#FF4747"
        />
        <Path
          d="M38.628 93.588l-.983 2.49.983-2.49zm37.056 14.633l.983-2.49-.983 2.49zM71.58 150v-2.676V150zm-90.189-11.174h-2.676 2.677zm0-7.301h2.677-2.676zm-18.917-22.356l2.547.821-2.547-.821zM3.867 33.134l1.858-1.927-1.858 1.927zm-18.39 4.62l-2.547-.821 2.547.82zm51.765 16.32l-1.338-2.318 1.338 2.318zM23.9 52.443l-1.858 1.927 1.858-1.927zm39.747-13.614L62.31 36.51l1.338 2.318zM42.83 82.968l.987-2.488-.987 2.488zm47.918 16.124L43.818 80.48l-1.974 4.976 46.93 18.612 1.974-4.976zM76.594 44.257l24.646 42.688 4.636-2.677L81.23 41.58l-4.636 2.677zM38.58 56.392l26.407-15.245-2.677-4.636-26.407 15.245 2.677 4.636zM2.01 35.062L22.043 54.37l3.715-3.854-20.033-19.31-3.715 3.855zM-34.98 109.99l23.004-71.416-5.095-1.641-23.004 71.415 5.095 1.642zm19.047 28.836v-7.301h-5.353v7.301h5.353zm87.512 8.498H-7.435v5.353H71.58v-5.353zm8.497-28.71v20.212h5.353v-20.212h-5.353zM37.645 96.077L74.7 110.71l1.966-4.979-37.056-14.633-1.966 4.98zm1.966-4.979a3.034 3.034 0 01-1.92-2.822h-5.353a8.387 8.387 0 005.307 7.801l1.966-4.979zm45.82 27.516a13.852 13.852 0 00-8.764-12.883l-1.966 4.979a8.5 8.5 0 015.376 7.904h5.353zM71.58 152.677c7.65 0 13.85-6.201 13.85-13.851h-5.353a8.498 8.498 0 01-8.497 8.498v5.353zm-92.865-13.851c0 7.65 6.2 13.851 13.85 13.851v-5.353a8.498 8.498 0 01-8.497-8.498h-5.353zm-7.016-14.316a7.016 7.016 0 017.016 7.015h5.353c0-6.831-5.538-12.369-12.369-12.369v5.354zm-11.773-16.162c-2.573 7.986 3.383 16.162 11.773 16.162v-5.354c-4.759 0-8.137-4.637-6.678-9.166l-5.095-1.642zM5.725 31.207c-7.377-7.11-19.654-4.027-22.795 5.726l5.095 1.64c1.928-5.982 9.459-7.874 13.985-3.512l3.715-3.854zm30.178 20.55a8.497 8.497 0 01-10.145-1.241l-3.715 3.854a13.85 13.85 0 0016.537 2.022l-2.676-4.636zM81.23 41.58c-3.825-6.624-12.296-8.894-18.92-5.07l2.677 4.637a8.497 8.497 0 0111.607 3.11l4.636-2.677zm-37.413 38.9c-5.506-2.184-11.479 1.873-11.479 7.796h5.353c0-2.142 2.16-3.61 4.153-2.82l1.973-4.976zm44.958 23.588c12.203 4.84 23.665-8.43 17.101-19.8l-4.636 2.677c4.027 6.975-3.005 15.116-10.492 12.147l-1.973 4.976z"
          fill="#191919"
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0_1387_133">
          <Path
            fill="#fff"
            transform="translate(0 .956)"
            d="M0 0h126.694v128.478H0z"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
