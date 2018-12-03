import { 
  Component, 
  ViewChild, 
  ViewContainerRef, 
  ComponentFactoryResolver, 
  Type } from '@angular/core';
import { FooComponent } from './foo/foo.component';

@Component({
  selector: 'app-root',
  template: `
  <!-- Pass the component class as an argument to add and remove based on the component class -->
  <button (click)="addComponent(fooComponentClass)">Add</button>
  <button (click)="removeComponent(fooComponentClass)">Remove</button>

  <div>
    <!-- Use ng-template to ensure that the generated components end up in the right place -->
    <ng-template #container>

    </ng-template>
  </div>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'vcr';

  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

  // Keep track of list of generated components for removal purposes
  components = [];

  // Expose class so that it can be used in the template
  fooComponentClass = FooComponent;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  addComponent(componentClass: Type<any>) {
    // Create component dynamically inside the ng-template
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    const component = this.container.createComponent(componentFactory);

    // Push the component so that we can keep track of which components are created
    this.components.push(component);
  }

  removeComponent(componentClass: Type<any>) {
    // Find the component
    const component = this.components.find((component) => component.instance instanceof componentClass);
    const componentIndex = this.components.indexOf(component);

    if (componentIndex !== -1) {
      // Remove component from both view and array
      this.container.remove(this.container.indexOf(component));
      this.components.splice(componentIndex, 1);
    }
  }
}
