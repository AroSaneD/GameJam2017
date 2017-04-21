import { GJPage } from './app.po';

describe('gj App', () => {
  let page: GJPage;

  beforeEach(() => {
    page = new GJPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
