export const pdf = jest.fn(() => ({
  toBlob: jest.fn(() => Promise.resolve(new Blob())),
  toString: jest.fn(() => Promise.resolve('mock-pdf-string'))
}));

export const Document = 'div';
export const Page = 'div';
export const Text = 'span';
export const View = 'div';
export const StyleSheet = {
  create: jest.fn((styles) => styles)
};