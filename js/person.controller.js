( function() {

	'use strict';

	/**
	 * Controllers
	 */

	angular.module( 'app' ).controller( 'PersonController', function( $scope ) {

		/**
		 * Metawidget config.
		 */
		
		$scope.metawidgetConfig = {

			//define the structure (i.e types and other attributes)
			inspector: new metawidget.inspector.JsonSchemaInspector( {
				properties: {
					id: {
						type: 'number'
					},

					firstname: {
						type: 'string',
						required: true
					},
					surname: {
						type: 'string',
						required: true
					},
					age: {
						type: 'number',
						minimum: 0		
					},
					superhero: {
						type: 'boolean',
						hidden: true
					},
					address: {
						properties: {
							street: {
								type: 'string'
							},
							city: {
								type: 'string'
							},
							country: {
								type: 'string'
							}
						}
					},
					children: {
						type: 'array',
						items: {
							properties: {
								firstname: {
									type: 'string'
								},
								surname: {
									type: 'string'
								}
							}
						}
					},
					edit: {
						type: 'function',
						hidden: '{{!readOnly}}'
					},
					save: {
						type: 'function',
						hidden: '{{readOnly}}'
					}
				}
			} ),

			/**
			 * Custom WidgetBuilder to instantiate our custom directive.
			 */

			widgetBuilder: new metawidget.widgetbuilder.CompositeWidgetBuilder( [ function( elementName, attributes, mw ) {

				// Editable tables

				if ( attributes.type === 'array' && !metawidget.util.isTrueOrTrueString( attributes.readOnly ) ) {

					var typeAndNames = metawidget.util.splitPath( mw.path );

					if ( typeAndNames.names === undefined ) {
						typeAndNames.names = [];
					}

					typeAndNames.names.push( attributes.name );
					typeAndNames.names.push( '0' );

					var inspectionResult = mw.inspect( mw.toInspect, typeAndNames.type, typeAndNames.names );
					var inspectionResultProperties = metawidget.util.getSortedInspectionResultProperties( inspectionResult );
					var columns = '';
					
					for ( var loop = 0, length = inspectionResultProperties.length; loop < length; loop++ ) {

						var columnAttribute = inspectionResultProperties[loop];

						if ( metawidget.util.isTrueOrTrueString( columnAttribute.hidden ) ) {
							continue;
						}

						if ( columns !== '' ) {
							columns += ',';
						}
						columns += columnAttribute.name;
					}

					var widget = $( '<table>' ).attr( 'edit-table', '' ).attr( 'columns', columns ).attr( 'ng-model', mw.path + '.' + attributes.name );
					return widget[0];
				}
			}, new metawidget.widgetbuilder.HtmlWidgetBuilder() ] ),
			addWidgetProcessors: [ new metawidget.bootstrap.widgetprocessor.BootstrapWidgetProcessor() ],
			layout: new metawidget.bootstrap.layout.BootstrapDivLayout()
		}

		/**
		 * Model.
		 */

		$scope.person = {
			id: 1,
			firstname: 'Francis',
			surname: 'Mendoza',
			age: 36,
			address: {
				street: 'Queen Street',
				city: 'Brisbane',
				country: 'Australia'
			},
			superhero: false,
			children: [ {
				firstname: 'Ada',
				surname: 'Mendoza'
			} ],
			edit: function() {
				$scope.readOnly = false;
			},
			save: function() {
				console.log ($scope.person);
				//persist to localStorage to get beany points from Richard (hehehe)
				localStorage.setItem($scope.person.id, $scope.person);
				clear();
			}
			
		};
		
		//clear all the fields
		function clear() {
			$scope.person.id++;
			$scope.person.firstname = '';
            $scope.person.surname = '';
            $scope.person.age = 0;
            $scope.person.superhero = false;
            $scope.person.address.street = '';
            $scope.person.address.city = '';
            $scope.person.address.country = '';
            $scope.person.children.firstname = '';
            $scope.person.children.lastname = '';
            
            //there must be a better way than this...
            document.getElementById("personFirstname").focus();
		}

		$scope.readOnly = true;

	} );
} )();
