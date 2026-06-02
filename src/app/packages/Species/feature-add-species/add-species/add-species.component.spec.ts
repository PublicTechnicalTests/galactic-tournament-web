import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { vi } from 'vitest';

import { AddSpeciesComponent } from './add-species.component';
import { SpeciesService } from '../../services/species.service';

describe('AddSpeciesComponent', () => {
  let component: AddSpeciesComponent;
  let fixture: ComponentFixture<AddSpeciesComponent>;
  let nativeEl: HTMLElement;
  let mockService: Partial<SpeciesService>;

  beforeEach(async () => {
    mockService = { add: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [AddSpeciesComponent, TranslateModule.forRoot()],
      providers: [{ provide: SpeciesService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeEl = fixture.nativeElement as HTMLElement;
  });

  // ── Render ─────────────────────────────────────────────────────────────────

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the modal with role="dialog"', () => {
    expect(nativeEl.querySelector('[role="dialog"]')).not.toBeNull();
  });

  it('should render name, power and ability inputs', () => {
    expect(nativeEl.querySelector('#species-name')).not.toBeNull();
    expect(nativeEl.querySelector('#species-power')).not.toBeNull();
    expect(nativeEl.querySelector('#species-ability')).not.toBeNull();
  });

  it('should render Cancel and Submit buttons', () => {
    const buttons = nativeEl.querySelectorAll<HTMLButtonElement>('.btn');
    const labels = Array.from(buttons).map((b) => b.type);
    expect(labels).toContain('button');
    expect(labels).toContain('submit');
  });

  // ── Validation ─────────────────────────────────────────────────────────────

  it('form should be invalid when empty', () => {
    expect(component['form'].invalid).toBe(true);
  });

  it('should show name required error after touching the field', () => {
    component['form'].get('name')!.markAsTouched();
    fixture.detectChanges();
    expect(nativeEl.querySelector('#species-name-error')).not.toBeNull();
  });

  it('should show power required error after touching the field', () => {
    component['form'].get('power')!.markAsTouched();
    fixture.detectChanges();
    expect(nativeEl.querySelector('#species-power-error')).not.toBeNull();
  });

  it('should show ability required error after touching the field', () => {
    component['form'].get('ability')!.markAsTouched();
    fixture.detectChanges();
    expect(nativeEl.querySelector('#species-ability-error')).not.toBeNull();
  });

  it('should mark all fields touched when submitting an empty form', () => {
    const submitBtn = nativeEl.querySelector<HTMLButtonElement>('[type="submit"]')!;
    submitBtn.click();
    fixture.detectChanges();
    const nameCtrl = component['form'].get('name')!;
    expect(nameCtrl.touched).toBe(true);
  });

  it('should not call service.add when form is invalid', () => {
    const submitBtn = nativeEl.querySelector<HTMLButtonElement>('[type="submit"]')!;
    submitBtn.click();
    fixture.detectChanges();
    expect(mockService.add).not.toHaveBeenCalled();
  });

  // ── Submission ─────────────────────────────────────────────────────────────

  it('should call service.add and emit added on valid submit', () => {
    const addedSpy = vi.fn();
    component.added.subscribe(addedSpy);

    component['form'].setValue({ name: 'Zorgons', power: 500, ability: 'Telekinesis' });
    component['submit']();
    fixture.detectChanges();

    expect(mockService.add).toHaveBeenCalledWith({
      name: 'Zorgons',
      power: 500,
      ability: 'Telekinesis',
    });
    expect(addedSpy).toHaveBeenCalled();
  });

  // ── Cancel / Confirm ────────────────────────────────────────────────────────

  it('should emit cancelled immediately when form is pristine', () => {
    const cancelledSpy = vi.fn();
    component.cancelled.subscribe(cancelledSpy);

    component['requestCancel']();
    expect(cancelledSpy).toHaveBeenCalled();
  });

  it('should show confirm dialog when form is dirty and cancel is requested', () => {
    component['form'].get('name')!.setValue('X');
    component['form'].get('name')!.markAsDirty();
    component['requestCancel']();
    fixture.detectChanges();

    expect(component['showConfirmCancel']()).toBe(true);
    expect(nativeEl.querySelector('[role="alertdialog"]')).not.toBeNull();
  });

  it('should emit cancelled after confirmCancel()', () => {
    const cancelledSpy = vi.fn();
    component.cancelled.subscribe(cancelledSpy);

    component['form'].get('name')!.setValue('X');
    component['requestCancel']();
    component['confirmCancel']();
    fixture.detectChanges();

    expect(cancelledSpy).toHaveBeenCalled();
    expect(component['showConfirmCancel']()).toBe(false);
  });

  it('should hide confirm dialog and keep modal open on dismissConfirm()', () => {
    const cancelledSpy = vi.fn();
    component.cancelled.subscribe(cancelledSpy);

    component['form'].get('name')!.setValue('X');
    component['form'].get('name')!.markAsDirty();
    component['requestCancel']();
    component['dismissConfirm']();
    fixture.detectChanges();

    expect(cancelledSpy).not.toHaveBeenCalled();
    expect(component['showConfirmCancel']()).toBe(false);
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  it('dialog should have aria-labelledby pointing to the title', () => {
    const dialog = nativeEl.querySelector('[role="dialog"]')!;
    const labelId = dialog.getAttribute('aria-labelledby');
    expect(labelId).toBeTruthy();
    expect(nativeEl.querySelector(`#${labelId}`)).not.toBeNull();
  });

  it('inputs should set aria-invalid when invalid and touched', () => {
    component['form'].get('name')!.markAsTouched();
    fixture.detectChanges();
    const nameInput = nativeEl.querySelector<HTMLInputElement>('#species-name')!;
    expect(nameInput.getAttribute('aria-invalid')).toBe('true');
  });

  it('error spans should have role="alert"', () => {
    component['form'].get('name')!.markAsTouched();
    fixture.detectChanges();
    const errorSpan = nativeEl.querySelector('#species-name-error');
    expect(errorSpan?.getAttribute('role')).toBe('alert');
  });
});
