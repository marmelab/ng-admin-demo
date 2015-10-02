export default function (nga, admin) {

    var settings = admin.getEntity('settings');

    settings.editionView()
        .title('Site Configuration')
        .fields([nga.field('configuration', 'json').label('')])
        .actions(['show']);

    settings.showView()
        .title('Site Configuration')
        .fields(settings.editionView().fields())
        .actions(['edit']);;

    return settings;
}
