import Svg, { Path } from 'react-native-svg';

export const FingerPrintIcon = ({ scale = 1 }: { scale?: number }) => {
  const width = 30 * scale;
  const height = 31 * scale;

  return (
    <Svg viewBox="0 0 32 32">
      <Path d="M17.304 31.36a.359.359 0 0 1-.358-.328c-.107-1.194-.877-2.479-2.315-2.479-1.32 0-2.088.743-2.898 1.943a.36.36 0 1 1-.597-.402c.793-1.175 1.765-2.262 3.495-2.262 1.89 0 2.896 1.626 3.032 3.136a.36.36 0 0 1-.326.391l-.033.001zm3.924-.944a.361.361 0 0 1-.188-.054c-1.921-1.176-3.114-3.067-3.114-4.937 0-.684.138-1.438.367-2.017a.361.361 0 0 1 .67.266c-.233.588-.316 1.29-.316 1.751 0 1.62 1.062 3.276 2.771 4.323a.36.36 0 0 1 .118.495.363.363 0 0 1-.308.173zM8.515 29.369a.36.36 0 0 1-.199-.66c2.824-1.873 5.107-3.688 7.404-5.884 1.207-1.155 3.23-3.471 3.23-6.009 0-1.57-1.115-3.193-2.981-3.193-1.72 0-3.014 1.943-4.265 3.823-.659.989-1.281 1.924-1.971 2.598-1.888 1.846-3.844 2.944-6.021 4.09a.36.36 0 0 1-.335-.636c2.126-1.119 4.034-2.189 5.853-3.969.635-.62 1.237-1.524 1.874-2.481 1.356-2.037 2.759-4.143 4.865-4.143 2.317 0 3.702 1.99 3.702 3.913 0 2.806-2.164 5.295-3.453 6.529-2.329 2.228-4.643 4.067-7.504 5.964a.373.373 0 0 1-.199.058zm16.658-1.149a.381.381 0 0 1-.132-.025c-3.283-1.29-3.973-3.946-3.973-5.946 0-.866.171-1.68.352-2.541.213-1.02.434-2.073.434-3.411 0-2.403-2.045-5.731-5.885-5.731-3.234 0-5.189 2.489-6.066 3.973-.842 1.425-3.189 4.884-6.778 6.211a.36.36 0 1 1-.25-.676c2.34-.865 4.735-3.071 6.408-5.902.956-1.616 3.094-4.326 6.686-4.326 3.951 0 6.605 3.335 6.605 6.451 0 1.412-.239 2.552-.45 3.558-.172.823-.335 1.602-.335 2.394 0 1.776.609 4.134 3.516 5.276a.36.36 0 0 1-.132.695zm-19.35-.834a.361.361 0 0 1-.189-.667c3.27-2.013 7.666-5.347 10.037-9.799a.36.36 0 0 1 .635.339c-2.448 4.595-6.95 8.015-10.296 10.074a.358.358 0 0 1-.187.053zm21.242-1.6a.368.368 0 0 1-.144-.03c-2.238-.974-2.677-2.361-2.677-4.431 0-1.291.149-1.939.307-2.627.169-.734.343-1.493.343-3.201 0-3.833-3.412-7.97-8.926-7.97-4.165 0-6.179 2.078-7.886 4.206a31.77 31.77 0 0 0-.615.803c-1.06 1.412-2.511 3.345-4.333 4.083a.36.36 0 1 1-.271-.667c1.637-.664 3.019-2.504 4.028-3.848.228-.303.437-.583.629-.821 1.816-2.265 3.964-4.476 8.447-4.476 5.958 0 9.646 4.511 9.646 8.69 0 1.789-.192 2.625-.361 3.362-.148.646-.288 1.257-.288 2.466 0 2.115.545 3.032 2.243 3.771a.36.36 0 0 1-.142.69zm.411-3.003a.36.36 0 0 1-.291-.573c.897-1.228 1.455-3.366 1.455-5.582 0-1.208-.097-2.531-.801-4.032a.36.36 0 0 1 .652-.306c.766 1.633.869 3.109.869 4.338 0 2.396-.596 4.643-1.594 6.008a.363.363 0 0 1-.29.147zM3.731 11.991a.36.36 0 0 1-.301-.558c2.164-3.285 5.818-7.652 12.538-7.652 4.662 0 8.979 2.327 11.547 6.226a.36.36 0 0 1-.602.396 13.071 13.071 0 0 0-10.945-5.902c-6.372 0-9.864 4.183-11.937 7.329a.356.356 0 0 1-.3.161zm23.042-6.063a.356.356 0 0 1-.257-.108c-2.763-2.822-6.548-4.447-10.385-4.46h-.057c-4.088 0-7.738 1.524-10.558 4.41a.36.36 0 0 1-.514-.503C7.96 2.239 11.789.64 16.074.64h.06c4.028.014 8.001 1.718 10.896 4.676a.36.36 0 0 1-.257.612z" />
      <Path
        d="M0 0h32v32H0z"
        // @ts-ignore
        style={{
          fill: 'none'
        }}
        viewBox={`0 0 ${width} ${height}`}
      />
    </Svg>
  );
};
