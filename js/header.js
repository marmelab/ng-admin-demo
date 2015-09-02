var username = window.localStorage.getItem('posters_galore_login');

export default `
<div class="navbar-header">
    <a class="navbar-brand" href="#" ng-click="appController.displayHome()">Posters Galore Administration</a>
</div>
<ul class="nav navbar-top-links navbar-right">
    <li dropdown>
        <a dropdown-toggle href="#" style="padding:15px" aria-expanded="true">
            <i class="fa fa-user fa-fw"></i> ${ username } <i class="fa fa-caret-down"></i>
        </a>
        <ul class="dropdown-menu dropdown-user" role="menu">
            <li><a href="#" onclick="logout()"><i class="fa fa-sign-out fa-fw"></i> Logout</a></li>
        </ul>
    </li>
</ul>
`;
