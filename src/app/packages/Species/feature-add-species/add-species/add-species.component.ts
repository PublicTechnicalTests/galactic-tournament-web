import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SpeciesService } from '../../services/species.service';

/**
 * AddSpeciesComponent
 *
 * Modal form to register a new galactic species.
 * Emits `added` when the species is saved, `cancelled` when the user
 * dismisses without saving.
 *
 * Includes an internal "confirm cancel" step:
 * when the form is dirty and the user clicks Cancel, a confirmation
 * dialog is shown before discarding changes.
 */
@Component({
  selector: 'app-add-species',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './add-species.component.html',
  styleUrl: './add-species.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddSpeciesComponent {
  /** Fired after a species has been saved successfully. */
  readonly added = output<void>();
  /** Fired after the user confirms cancellation. */
  readonly cancelled = output<void>();

  protected readonly showConfirmCancel = signal(false);

  private readonly fb = inject(FormBuilder);
  private readonly speciesService = inject(SpeciesService);

  protected readonly form = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.maxLength(100)],
    ],
    power: [
      null as number | null,
      [Validators.required, Validators.min(1), Validators.max(9999)],
    ],
    ability: [
      '',
      [Validators.required, Validators.maxLength(255)],
    ],
  });

  // ── Public helpers ────────────────────────────────────────────────────────

  protected isInvalid(field: 'name' | 'power' | 'ability'): boolean {
    const ctrl = this.form.get(field)!;
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  protected hasError(
    field: 'name' | 'power' | 'ability',
    error: string
  ): boolean {
    return !!this.form.get(field)?.hasError(error);
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, power, ability } = this.form.getRawValue();
    this.speciesService.add({
      name: name!,
      power: power!,
      ability: ability!,
    });

    this.added.emit();
  }

  protected requestCancel(): void {
    if (this.form.dirty) {
      this.showConfirmCancel.set(true);
    } else {
      this.cancelled.emit();
    }
  }

  protected confirmCancel(): void {
    this.showConfirmCancel.set(false);
    this.cancelled.emit();
  }

  protected dismissConfirm(): void {
    this.showConfirmCancel.set(false);
  }
}
