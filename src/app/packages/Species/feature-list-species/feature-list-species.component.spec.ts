import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';

import { FeatureListSpeciesComponent } from './feature-list-species.component';
import { SpeciesService } from '../services/species.service';

describe('FeatureListSpeciesComponent', () => {
  let component: FeatureListSpeciesComponent;
  let fixture: ComponentFixture<FeatureListSpeciesComponent>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureListSpeciesComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), SpeciesService],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureListSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeEl = fixture.nativeElement as HTMLElement;
  });

  // ── Unit tests ─────────────────────────────────────────────────────────────

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the page header', () => {
    expect(nativeEl.querySelector('.feature-list-species__header')).not.toBeNull();
  });

  it('should render the add-species button', () => {
    expect(nativeEl.querySelector('.btn--primary')).not.toBeNull();
  });

  it('should render the list-species child component', () => {
    expect(nativeEl.querySelector('app-list-species')).not.toBeNull();
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  it('add button should have an aria-label', () => {
    const btn = nativeEl.querySelector<HTMLButtonElement>('.btn--primary')!;
    expect(btn.getAttribute('aria-label')).toBeTruthy();
  });

  // ── Modal integration ──────────────────────────────────────────────────────

  it('should expose openAddModal, onSpeciesAdded and onAddCancelled methods', () => {
    const c = component as unknown as Record<string, unknown>;
    expect(typeof c['openAddModal']).toBe('function');
    expect(typeof c['onSpeciesAdded']).toBe('function');
    expect(typeof c['onAddCancelled']).toBe('function');
  });

  it('modal should NOT be visible initially', () => {
    expect(nativeEl.querySelector('app-add-species')).toBeNull();
  });

  it('modal should appear after openAddModal()', () => {
    (component as unknown as Record<string, () => void>)['openAddModal']();
    fixture.detectChanges();
    expect(nativeEl.querySelector('app-add-species')).not.toBeNull();
  });

  it('modal should disappear after onAddCancelled()', () => {
    (component as unknown as Record<string, () => void>)['openAddModal']();
    fixture.detectChanges();
    (component as unknown as Record<string, () => void>)['onAddCancelled']();
    fixture.detectChanges();
    expect(nativeEl.querySelector('app-add-species')).toBeNull();
  });

  it('modal should disappear after onSpeciesAdded()', () => {
    (component as unknown as Record<string, () => void>)['openAddModal']();
    fixture.detectChanges();
    (component as unknown as Record<string, () => void>)['onSpeciesAdded']();
    fixture.detectChanges();
    expect(nativeEl.querySelector('app-add-species')).toBeNull();
  });
});
