import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeEl = fixture.nativeElement as HTMLElement;
  });

  // ── Unit tests ─────────────────────────────────────────────────────────────

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the sidebar', () => {
    expect(nativeEl.querySelector('app-sidebar')).not.toBeNull();
  });

  it('should render the main content area', () => {
    expect(nativeEl.querySelector('main.layout__content')).not.toBeNull();
  });

  // ── Accessibility tests ─────────────────────────────────────────────────────

  it('should have a skip-to-content link', () => {
    const skipLink = nativeEl.querySelector<HTMLAnchorElement>('.skip-link')!;
    expect(skipLink).not.toBeNull();
    expect(skipLink.getAttribute('href')).toBe('#main-content');
  });

  it('should have main content with id="main-content" for skip link target', () => {
    expect(nativeEl.querySelector('#main-content')).not.toBeNull();
  });

  it('should have tabindex="-1" on main to allow programmatic focus', () => {
    const main = nativeEl.querySelector<HTMLElement>('#main-content')!;
    expect(main.getAttribute('tabindex')).toBe('-1');
  });

  // ── Integration tests ───────────────────────────────────────────────────────

  it('should render router-outlet inside main content', () => {
    expect(nativeEl.querySelector('router-outlet')).not.toBeNull();
  });

  it('should have layout flex container wrapping sidebar and content', () => {
    expect(nativeEl.querySelector('.layout')).not.toBeNull();
  });
});
