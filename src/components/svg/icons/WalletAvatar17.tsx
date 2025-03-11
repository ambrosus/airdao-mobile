import { Defs, Path, Svg, ClipPath, G } from 'react-native-svg';
import { IconProps } from './Icon.types';

export function WalletAvatar17(props: Omit<IconProps, 'color'>) {
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
      <G clipPath="url(#prefix__clip0_1387_185)">
        <Path fill="#3568DD" d="M0 .912h126.694V129.39H0z" />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M155.081 155.052c6.097 9.263 20.508 4.947 20.508-6.143v-41.174a10.793 10.793 0 00-10.132-10.773 10.794 10.794 0 01-10.132-10.773l.001-38.125c0-8.509-9.132-13.895-16.579-9.78L54.763 84.697a9.08 9.08 0 01-9.21-.25c-7.811-4.89-17.097 3.617-12.907 11.824l22.212 43.508a11.174 11.174 0 009.952 6.093h78.207c3.76 0 7.267 1.89 9.334 5.031l2.73 4.149zm-40.722-31.623c8.514-.612 13.225-10.158 8.533-17.288l-.942-1.432a11.175 11.175 0 00-7.747-4.918l-18.676-2.68a8.246 8.246 0 00-6.897 2.227c-3.858 3.723-3.194 10.079 1.35 12.924l15.418 9.653a11.171 11.171 0 006.73 1.674l2.231-.16z"
          fill="#86C537"
        />
        <Path
          d="M105.398 121.915l-1.421 2.268 1.421-2.268zm-15.418-9.653l1.42-2.269-1.42 2.269zm5.547-15.152l-.38 2.65.38-2.65zm26.423 7.599l2.235-1.472-2.235 1.472zm-7.747-4.918l-.38 2.65.38-2.65zm8.689 6.35l2.236-1.472-2.236 1.472zm-8.533 17.288l-.191-2.67.191 2.67zm28.658 22.443v-2.677 2.677zm-88.16-6.093l2.385-1.217-2.384 1.217zm9.953 6.093v2.676-2.676zm-32.164-49.6l2.384-1.218-2.384 1.217zm22.117-11.575l-1.295-2.342 1.295 2.342zm100.563-36.633h2.676-2.676zm-16.579-9.78l-1.295-2.342 1.295 2.342zm16.578 47.905h-2.676 2.676zm-.244 68.863l2.236-1.472-2.236 1.472zm20.508-47.317h2.677-2.677zm-2.677 0v41.174h5.354v-41.174h-5.354zm-14.91-21.546V48.064h-5.353V86.19h5.353zm-20.55-50.247L53.468 82.355l2.59 4.685 83.984-46.413-2.59-4.685zM30.262 97.488l22.212 43.508 4.768-2.434L35.03 95.054l-4.768 2.434zm34.547 51.06h78.208v-5.353H64.81v5.353zm92.508 5.032l-2.73-4.149-4.472 2.943 2.731 4.149 4.471-2.943zm-32.189-48.911l-.943-1.432-4.471 2.943.942 1.432 4.472-2.943zm-29.98-4.91l18.675 2.682.761-5.3-18.676-2.68-.76 5.299zm11.67 19.887L91.4 109.993l-2.84 4.538 15.417 9.652 2.841-4.537zm7.35 1.113l-2.232.16.384 5.34 2.231-.161-.383-5.339zm-10.191 3.424a13.846 13.846 0 008.343 2.076l-.384-5.34a8.488 8.488 0 01-5.118-1.273l-2.841 4.537zM86.772 97.412c-5.11 4.93-4.232 13.35 1.787 17.119l2.841-4.538c-3.069-1.921-3.517-6.214-.911-8.728l-3.717-3.853zm9.136-2.951c-3.338-.48-6.71.61-9.136 2.95l3.717 3.854a5.568 5.568 0 014.658-1.505l.76-5.3zm28.277 8.776a13.85 13.85 0 00-9.601-6.095l-.761 5.299a8.498 8.498 0 015.891 3.739l4.471-2.943zm-3.529 4.375c3.569 5.422-.014 12.682-6.488 13.147l.383 5.339c10.554-.758 16.393-12.591 10.577-21.429l-4.472 2.943zm22.361 40.936a8.498 8.498 0 017.098 3.826l4.472-2.943a13.853 13.853 0 00-11.57-6.236v5.353zm-90.543-7.552a13.85 13.85 0 0012.336 7.552v-5.353a8.498 8.498 0 01-7.569-4.633l-4.767 2.434zm-5.502-58.819c-10.112-6.33-22.135 4.685-16.71 15.311l4.768-2.434c-2.955-5.787 3.594-11.788 9.102-8.34l2.84-4.537zm6.496.178a6.404 6.404 0 01-6.496-.178l-2.84 4.538a11.757 11.757 0 0011.925.325l-2.589-4.685zm104.534-34.29c0-10.548-11.318-17.225-20.55-12.123l2.59 4.685c5.663-3.13 12.607.966 12.607 7.437h5.353zm7.619 46.225a8.117 8.117 0 01-7.619-8.1h-5.353c0 7.118 5.539 13.008 12.644 13.444l.328-5.344zm7.291 54.619c0 8.433-10.959 11.716-15.595 4.671l-4.471 2.943c7.557 11.483 25.42 6.132 25.42-7.614h-5.354zm5.354-41.174c0-7.119-5.54-13.008-12.645-13.445l-.328 5.344a8.116 8.116 0 017.619 8.101h5.354z"
          fill="#191919"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M142.624 8c-5.473 0-9.221-5.52-7.204-10.608l17.506-44.14c3.904-9.845-6.802-19.092-15.974-13.796L94.264-35.898c-5.344 3.085-7.175 9.92-4.09 15.264L105.42 5.771a11.173 11.173 0 01-1.632 13.341L84.48 39.146c-5.737 5.952-3.249 15.856 4.619 18.39l71.416 23.004c6.257 2.016 12.664-2.651 12.664-9.225 0-5.353 4.339-9.693 9.692-9.693h11.691c6.171 0 11.174-5.002 11.174-11.174v-79.014c0-6.171-5.003-11.174-11.174-11.174h-20.213a11.174 11.174 0 00-10.393 7.07L149.832 3.096a7.749 7.749 0 01-7.208 4.903z"
          fill="#EF59B3"
        />
        <Path
          d="M149.832 3.096l-2.489-.983 2.489.983zm14.124-35.766l-2.489-.983 2.489.983zM89.099 57.536l-.82 2.548.82-2.548zM105.42 5.772l-2.318 1.338 2.318-1.338zm30-8.38l-2.488-.986 2.488.986zm17.506-44.14l-2.488-.987 2.488.987zm-2.488-.987l-17.506 44.14 4.977 1.974 17.505-44.14-4.976-1.974zM95.603-33.58l42.687-24.646-2.676-4.636-42.688 24.646 2.677 4.636zm12.135 38.014L92.492-21.973l-4.636 2.677L103.102 7.11l4.636-2.676zm-21.331 36.57l19.309-20.033-3.855-3.715-19.309 20.033 3.855 3.715zm74.928 36.988L89.92 54.988l-1.642 5.096 71.416 23.004 1.641-5.096zm33.227-19.047h-11.691V64.3h11.691v-5.354zm8.497-87.511v79.014h5.353v-79.014h-5.353zm-28.71-8.497h20.213v-5.354h-20.213v5.354zM152.322 4.079l14.124-35.766-4.979-1.966-14.124 35.766 4.979 1.966zm-4.979-1.966a5.073 5.073 0 01-4.719 3.21v5.353c4.281 0 8.126-2.616 9.698-6.597l-4.979-1.966zm27.006-44.53a13.85 13.85 0 00-12.882 8.764l4.979 1.966a8.497 8.497 0 017.903-5.376v-5.354zm34.063 13.85c0-7.649-6.201-13.85-13.85-13.85v5.354a8.497 8.497 0 018.497 8.497h5.353zM194.562 64.3c7.649 0 13.85-6.201 13.85-13.85h-5.353a8.497 8.497 0 01-8.497 8.497v5.353zm-18.707 7.016a7.016 7.016 0 017.016-7.016v-5.354c-6.831 0-12.369 5.538-12.369 12.37h5.353zm-16.161 11.773c7.986 2.572 16.161-3.383 16.161-11.773h-5.353c0 4.758-4.637 8.136-9.167 6.677l-1.641 5.096zm-77.141-45.8c-7.111 7.378-4.027 19.654 5.725 22.796l1.642-5.096c-5.984-1.927-7.875-9.458-3.513-13.984l-3.855-3.715zM103.101 7.11a8.496 8.496 0 01-1.241 10.146l3.855 3.715a13.851 13.851 0 002.022-16.537l-4.636 2.676zM92.926-38.216c-6.625 3.825-8.894 12.295-5.07 18.92l4.636-2.677a8.497 8.497 0 013.11-11.607l-2.676-4.636zm40.006 34.622c-2.714 6.844 2.329 14.27 9.692 14.27V5.322c-3.582 0-6.036-3.613-4.715-6.943l-4.977-1.973zm22.482-42.167c4.84-12.203-8.431-23.665-19.8-17.101l2.676 4.636c6.975-4.027 15.117 3.005 12.148 10.491l4.976 1.974z"
          fill="#191919"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M-21.64 71.19c0-5.472 5.52-9.22 10.607-7.203l44.14 17.505c9.845 3.904 19.092-6.802 13.796-15.974L22.258 22.832c-3.086-5.345-9.92-7.176-15.264-4.09l-26.407 15.245a11.174 11.174 0 01-13.34-1.631l-20.034-19.309c-5.952-5.736-15.855-3.249-18.39 4.62L-94.18 89.08c-2.016 6.258 2.651 12.664 9.226 12.664 5.353 0 9.692 4.34 9.692 9.692v11.691c0 6.171 5.003 11.174 11.174 11.174h79.015c6.17 0 11.173-5.003 11.173-11.174v-20.213c0-4.587-2.803-8.708-7.07-10.392l-35.765-14.124a7.75 7.75 0 01-4.904-7.208z"
          fill="#EF59B3"
        />
        <Path
          d="M19.03 92.523l.983-2.49-.983 2.49zm-4.104 41.779v-2.677 2.677zm-90.189-11.174h-2.676 2.676zm11.174 11.174v2.677-2.677zm-11.174-22.865h-2.676 2.676zM-94.18 89.081l-2.547-.82 2.547.82zm41.394-76.035l1.858-1.927-1.858 1.927zm-18.39 4.62l-2.547-.821 2.547.82zm51.765 16.32l-1.339-2.317 1.338 2.317zm52.52 47.506l.986-2.488-.987 2.488zm.986-2.488L-10.046 61.5l-1.974 4.976L32.12 83.98l1.974-4.976zM19.94 24.17l24.645 42.688 4.636-2.677-24.645-42.688-4.636 2.677zm-38.014 12.135L8.332 21.06l-2.676-4.636-26.407 15.246 2.677 4.635zm-36.57-21.33l20.033 19.308 3.715-3.854-20.033-19.31-3.715 3.855zm-36.99 74.928l23.005-71.416-5.096-1.641-23.004 71.415 5.096 1.642zm19.048 33.226v-11.691h-5.353v11.691h5.353zm87.512 8.497H-64.09v5.354h79.015v-5.354zm8.497-28.71v20.213h5.353v-20.213h-5.353zM-17.72 80.888l35.766 14.124 1.966-4.979-35.766-14.124-1.966 4.98zm1.966-4.979a5.073 5.073 0 01-3.21-4.718h-5.353c0 4.28 2.615 8.125 6.596 9.697l1.967-4.979zm44.53 27.006a13.85 13.85 0 00-8.764-12.882l-1.966 4.98a8.497 8.497 0 015.376 7.902h5.353zm-13.851 34.064c7.65 0 13.85-6.201 13.85-13.851h-5.353a8.497 8.497 0 01-8.497 8.497v5.354zm-92.865-13.851c0 7.65 6.2 13.851 13.85 13.851v-5.354a8.497 8.497 0 01-8.497-8.497h-5.353zm-7.016-18.706a7.016 7.016 0 017.016 7.015h5.353c0-6.831-5.538-12.368-12.37-12.368v5.353zM-96.728 88.26c-2.573 7.986 3.383 16.162 11.773 16.162v-5.353c-4.759 0-8.137-4.638-6.678-9.167l-5.096-1.642zM-50.93 11.12c-7.378-7.11-19.654-4.027-22.796 5.726l5.096 1.641c1.927-5.983 9.459-7.875 13.985-3.513l3.715-3.854zm30.178 20.55a8.497 8.497 0 01-10.145-1.241l-3.715 3.854a13.85 13.85 0 0016.537 2.023l-2.677-4.636zm45.327-10.177c-3.825-6.624-12.296-8.894-18.92-5.07l2.676 4.637a8.497 8.497 0 0111.608 3.11l4.636-2.677zM-10.046 61.5c-6.845-2.715-14.27 2.329-14.27 9.692h5.353c0-3.583 3.613-6.037 6.943-4.716l1.974-4.976zM32.12 83.98c12.203 4.84 23.664-8.43 17.1-19.8l-4.636 2.677c4.027 6.975-3.004 15.116-10.49 12.147L32.12 83.98z"
          fill="#191919"
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0_1387_185">
          <Path
            fill="#fff"
            transform="translate(0 .912)"
            d="M0 0h126.694v128.478H0z"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
