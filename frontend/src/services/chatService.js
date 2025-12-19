export function sendMessageMock(message) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        reply: `${message}`, // Echo the message back
      });
    }, 1000);
  });
}
