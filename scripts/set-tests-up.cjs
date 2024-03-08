// @ts-ignore
global.crypto.randomUUID = () => String(Math.floor(Math.random() * 1000));
document.documentElement.lang = 'en';

beforeAll(() => {
  // @ts-ignore
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());
  window.fetch = jest.fn();
  jest.spyOn(console, 'error');
});

afterAll(() => {
  window.requestAnimationFrame.mockRestore();
  window.fetch = undefined;
});


beforeEach(() => {
  console.error.mockClear();
  document.body.innerHTML = ''
  jest.clearAllMocks()
})
