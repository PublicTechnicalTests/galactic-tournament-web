import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeEl = fixture.nativeElement as HTMLElement;
  });

  // ── Unit tests ─────────────────────────────────────────────────────────────

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render two navigation links', () => {
    const links = nativeEl.querySelectorAll('.sidebar__nav-link');
    expect(links.length).toBe(2);
  });

  it('should start in expanded state', () => {
    expect(nativeEl.querySelector('.sidebar--collapsed')).toBeNull();
  });

  it('should toggle to collapsed when toggle button is clicked', () => {
    const btn = nativeEl.querySelector<HTMLButtonElement>('.sidebar__toggle')!;
    btn.click();
    fixture.detectChanges();
    expect(nativeEl.querySelector('.sidebar--collapsed')).not.toBeNull();
  });

  it('should restore expanded state on second click', () => {
    const btn = nativeEl.querySelector<HTMLButtonElement>('.sidebar__toggle')!;
    btn.click();
    fixture.detectChanges();
    btn.click();
    fixture.detectChanges();
    expect(nativeEl.querySelector('.sidebar--collapsed')).toBeNull();
  });

  // ── Accessibility tests ─────────────────────────────────────────────────────

  it('should set aria-expanded="true" when expanded', () => {
    const aside = nativeEl.querySelector('aside')!;
    expect(aside.getAttribute('aria-expanded')).toBe('true');
  });

  it('should set aria-expanded="false" when collapsed', () => {
    const btn = nativeEl.querySelector<HTMLButtonElement>('.sidebar__toggle')!;
    btn.click();
    fixture.detectChanges();
    const aside = nativeEl.querySelector('aside')!;
    expect(aside.getAttribute('aria-expanded')).toBe('false');
  });

  it('should have an aria-label on the aside element', () => {
    const aside = nativeEl.querySelector('aside')!;
    expect(aside.getAttribute('aria-label')).toBe('Main navigation');
  });

  it('should have a nav element inside the sidebar', () => {
    expect(nativeEl.querySelector('nav')).not.toBeNull();
  });

  it('should hide nav labels when collapsed', () => {
    const btn = nativeEl.querySelector<HTMLButtonElement>('.sidebar__toggle')!;
    btn.click();
    fixture.detectChanges();
    const labels = nativeEl.querySelectorAll('.sidebar__nav-label');
    expect(labels.length).toBe(0);
  });

  // ── Integration tests ───────────────────────────────────────────────────────

  it('should show nav labels when expanded', () => {
    const labels = nativeEl.querySelectorAll('.sidebar__nav-label');
    expect(labels.length).toBe(2);
  });

  it('should render icons with aria-hidden', () => {
    const icons = nativeEl.querySelectorAll('.sidebar__nav-icon[aria-hidden="true"]');
    expect(icons.length).toBe(2);
  });
});
