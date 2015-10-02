export default function (nga, admin) {

    var configurations = admin.getEntity('configurations');
    configurations.editionView()
        .title('Site configuration')
        .fields([nga.field('value', 'json')])
        .actions(['show']);
    configurations.showView()
        .title('Site configuration')
        .fields(configurations.editionView().fields())
        .actions(['edit']);;

    return configurations;
}
