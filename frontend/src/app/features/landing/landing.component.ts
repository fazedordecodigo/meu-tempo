import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="landing-container">
      <header>
        <h1>Meu Tempo</h1>
        <nav>
          <a routerLink="/auth/login">Login</a>
          <a routerLink="/auth/register">Registrar</a>
        </nav>
      </header>

      <main>
        <section class="hero">
          <h2>Gerencie seu tempo de forma eficiente</h2>
          <p>Uma plataforma completa para gerenciar seus compromissos e otimizar seu dia a dia.</p>
          <button routerLink="/auth/register">Comece agora</button>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 Meu Tempo - Todos os direitos reservados</p>
      </footer>
    </div>
  `,
  styles: [`
    .landing-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #f8f9fa;
    }

    nav a {
      margin-left: 1rem;
      text-decoration: none;
      color: #0275d8;
    }

    .hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 4rem 2rem;
      background-color: #e9ecef;
      flex: 1;
    }

    .hero h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .hero p {
      font-size: 1.2rem;
      max-width: 600px;
      margin-bottom: 2rem;
    }

    .hero button {
      padding: 0.8rem 1.5rem;
      background-color: #0275d8;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
    }

    footer {
      padding: 1rem;
      background-color: #f8f9fa;
      text-align: center;
    }
  `]
})
export class LandingComponent {
}
