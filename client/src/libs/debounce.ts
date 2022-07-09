export default function debounce(cb: CallableFunction, delay: number) {
  let timeOut: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}
