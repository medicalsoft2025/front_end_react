<nav class="navbar navbar-top fixed-top navbar-expand-lg" id="navbarCombo" data-navbar-top="combo"
    data-move-target="#navbarVerticalNav">
    <div class="navbar-logo">
        <a class="navbar-brand me-1 me-sm-3" href="/Dashboard">
            <div class="d-flex align-items-center">
                <div class="d-flex align-items-center" id=""><img src="/logo_monaros_sinbg_light.png" alt="home"
                        width="125" />
                </div>
            </div>
        </a>
    </div>

    <div class="collapse navbar-collapse navbar-top-collapse order-1 order-lg-0 justify-content-center"
        id="navbarTopCollapse">
        <ul class="navbar-nav navbar-nav-top" data-dropdown-on-hover="data-dropdown-on-hover">
            <li class="nav-item dropdown"><a class="nav-link dropdown-toggle lh-1" href="#!" role="button"
                    data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true"
                    aria-expanded="false"><span class="uil fs-8 me-2 uil-home"></span>Inicio</a>
                <ul class="dropdown-menu navbar-dropdown-caret">
                    <li><a class="dropdown-item" href="Dashboard">
                            <div class="dropdown-item-wrapper mt-1"><span class="me-2 uil"
                                    data-feather="home"></span>Inicio
                            </div>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    <ul class="navbar-nav navbar-nav-icons flex-row">
        <li class="nav-item dropdown">
            <!-- Botón de notificaciones con icono de Bootstrap -->
            <a id="btnNotificaciones" class="nav-link position-relative" href="#" role="button"
                data-bs-toggle="dropdown" aria-expanded="false">
                <span class="far fa-bell"></span>
            </a>

            <!-- Menú desplegable de notificaciones -->
            <div class="dropdown-menu dropdown-menu-end py-0 shadow border navbar-dropdown-caret"
                style="width: 450px !important; margin-right: -10px;">
                <div class="card position-relative border-0">
                    <!-- Cabecera del menú -->
                    <div class="card-header p-2 mt-1">
                        <div class="d-flex justify-content-between">
                            <h5 class="card-title mb-0">Notificaciones</h5>
                            <button id="markAllButton" class="btn btn-link p-0 fs-9 fw-normal" type="button">Marcar como
                                leídas</button>
                        </div>
                    </div>

                    <!-- Cuerpo del menú con lista de notificaciones -->
                    <div id="bodyNotificaciones" class="card-body p-0" style="max-height: 500px; overflow-y: auto;">
                        <!-- Notificaciones cargadas por medio del script -->
                    </div>

                    <!-- Pie del menú -->
                    <div class="card-footer p-0 border-top">
                        <div class="my-2 text-center fw-bold fs-10 text-body-tertiary">
                            <a class="fw-bolder" href="#">Historial de notificaciones</a>
                        </div>
                    </div>
                </div>
            </div>
        </li>

        <li class="nav-item dropdown"><a class="nav-link lh-1 pe-0" id="navbarDropdownUser" href="#!" role="button"
                data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false">
                <div class="avatar avatar-l ">
                    <img class="rounded-circle user-avatar" src="assets/img/profile/profile_default.jpg" alt="" />
                </div>
            </a>
            <div class="dropdown-menu dropdown-menu-end navbar-dropdown-caret py-0 dropdown-profile shadow border"
                aria-labelledby="navbarDropdownUser">
                <div class="card position-relative border-0">
                    <div class="card-body p-0">
                        <div class="text-center pt-4 pb-3">
                            <div class="avatar avatar-xl ">
                                <img class="rounded-circle user-avatar" src="assets/img/profile/profile_default.jpg"
                                    alt="" />
                            </div>
                            <h6 class="mt-2 text-body-emphasis username"></h6>
                            <b class="mt-2 text-body-emphasis"><span class="user-role"></span><span
                                    class="user-specialty"></span></b>
                        </div>
                    </div>
                    <div class="overflow-auto scrollbar" style="height: 4rem;">
                        <ul class="nav d-flex flex-column mb-2 pb-1">
                            <li class="nav-item"><a class="nav-link px-3 d-block" href="#settings-offcanvas"
                                    data-bs-toggle="offcanvas"> <span class="me-2 text-body align-bottom"
                                        data-feather="sliders"></span>Personalizar</a></li>
                        </ul>
                    </div>
                    <div class="px-3"> <a class="btn btn-phoenix-secondary d-flex flex-center w-100" id="btn-logout"
                            href="#">
                            <span class="me-2" data-feather="log-out"> </span>Cerrar Sesión</a></div>
                </div>
            </div>
        </li>
    </ul>
</nav>