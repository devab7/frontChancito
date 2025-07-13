import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding m-b-20">
      <a [routerLink]="['/pages/clientes']" style="display: flex; align-items:center; text-decoration:none">
        <img
          src="./assets/images/logos/logo-chanchito.png"
          class="align-middle m-2 logo"
          alt="logo"
        />
          <div class="logo-text">CHANCHITO</div>
      </a>
    </div>
  `,
})
export class BrandingComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService) {}
}
