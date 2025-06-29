import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[tipoPagoColor]',
  standalone: true
})
export class TipoPagoColorDirective implements OnChanges {
  @Input('tipoPagoColor') tipoPagoColor?: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('tipoPagoColor' in changes) {
      const clase = this.obtenerClase(this.tipoPagoColor?.toLowerCase());

      // Limpia clases previas relacionadas
      this.limpiarClases();

      // Aplica la nueva clase
      if (clase) {
        this.renderer.addClass(this.el.nativeElement, clase);
      }
    }
  }

  private obtenerClase(tipo: string | undefined): string | null {
    switch (tipo) {
      case 'efectivo':
        return 'bg-pago-efectivo';
      case 'bcp':
        return 'bg-pago-bcp';
      case 'interbank':
        return 'bg-pago-interbank';
      default:
        return null;
    }
  }

  private limpiarClases(): void {
    const clases = ['bg-pago-efectivo', 'bg-pago-bcp', 'bg-pago-interbank'];
    clases.forEach(clase => {
      this.renderer.removeClass(this.el.nativeElement, clase);
    });
  }
}
