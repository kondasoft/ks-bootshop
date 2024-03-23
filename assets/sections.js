/*
  © 2024 KondaSoft
  https://www.kondasoft.com
*/

class Navbar extends HTMLElement {
  constructor () {
    super()

    this.handleDropdownsBackdrop()
    this.handleHeaderReveal()
    this.adjustOffcanvasMenu()
  }

  adjustOffcanvasMenu () {
    const offcanvasMenu = document.querySelector('#offcanvas-menu')
    const navbarMobile = document.querySelector('#navbar-mobile')

    offcanvasMenu?.addEventListener('show.bs.offcanvas', () => {
      const navbarSpacing = document.querySelector('#navbar-mobile').getBoundingClientRect().bottom
      offcanvasMenu.style.height = `${window.innerHeight - navbarSpacing}px`

      navbarMobile.querySelector('.svg-icon-menu')?.classList.add('svg-icon-menu-close')
    })

    offcanvasMenu?.addEventListener('hide.bs.offcanvas', () => {
      navbarMobile.querySelector('.svg-icon-menu')?.classList.remove('svg-icon-menu-close')
    })
  }

  handleHeaderReveal () {
    let oldScroll = window.scrollY
    const headerGroup = document.querySelector('#header-group')

    window.addEventListener('scroll', () => {
      const newScroll = window.scrollY
      if (newScroll > oldScroll) {
        if (newScroll > headerGroup.clientHeight) {
          headerGroup.classList.add('hide')
        }
      } else if (newScroll < oldScroll) {
        headerGroup.classList.remove('hide')
      }

      oldScroll = Math.max(window.scrollY, 0)
    })
  }

  handleDropdownsBackdrop () {
    this.querySelectorAll('#navbar-desktop .dropdown-toggle').forEach(dropdown => {
      dropdown.addEventListener('hidden.bs.dropdown', () => {
        if (!document.querySelector('#navbar-desktop .dropdown-toggle.show')) {
          document.body.classList.remove('navbar-dropdown-open')
        }
      })
      dropdown.addEventListener('show.bs.dropdown', () => {
        document.body.classList.add('navbar-dropdown-open')
      })
    })
  }
}
customElements.define('navbar-wrapper', Navbar)
