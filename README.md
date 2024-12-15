# IneoTest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.12.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Mock Backend

Navigate to `./server` and run `node index.js` to start the mock backend server. The server will run on `http://localhost:3000/`.

# Decisions

## Libraries

I used the following libraries in the project:
PrimeNG: I used PrimeNG to create the UI components of the project.

PrimeNG is a collection of rich UI components for Angular. All widgets are open source and free to use under the MIT License.

## Store Management

For the sake of the simplicity of the project, I decided not to use any state management library like NgRx. Instead, I used Angular services to manage the state of the application. This is not the best approach for a real-world application, but it is enough for this project.

I used the the service inside `temp-drag-cache.service.ts` to store the data of the dragged element. This service is used to store the data of the dragged element and to share it between the components.

Also since there is no state management library, I rely a lot on mutation Subjects to fetch new data from the server and to update the data in the components whenever the data changes.

In a real-world application, I would use NgRx to manage the state of the application and to handle the side effects, also i would update the store using websockets to get the real-time updates from the server.

## Pagination, Sorting, and Filtering

The project was focused on the front-end side, so I decided to leave the pagination, sorting, and filtering on the front-end side.

## Design Patterns

I used the Observer pattern to notify the components when the data changes. I used the Subject class from RxJS to implement this pattern.
I used the Singleton pattern to create a single instance of the TempDragCacheService class. (all the services in Angular are singletons by default)

In a real-world application, I would rely more on strategies and factories to create the components and to handle the different behaviors of the components.
In particular, I would use the Strategy pattern to inject the different services that the components need to work with, this way I can easily change the behavior of the components by changing the injected service and not depend directly on the primeNg services.

I would also create facades to all the primeNg components that I use in the project, this way I can easily change the library that I use to create the UI components if the project requirements change or the library is deprecated / becomes a paid library.

I would create a base CrudService class that the other services can extend to create the CRUD operations for the different entities in the project and put common loggings and error handling in the base class.
