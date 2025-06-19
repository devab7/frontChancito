import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding m-b-20">
      <a [routerLink]="['/']" style="display: flex; align-items:center; text-decoration:none">
        <img
          src="./assets/images/logos/logo-chanchito.png"
          class="align-middle m-2"
          alt="logo"
          style="width:40px"
        />
          <div style="color:#0a7ea4; margin-left: 5px; font-size:25px">Chanchito</div>
      </a>
    </div>
  `,
})
export class BrandingComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService) {}
}
