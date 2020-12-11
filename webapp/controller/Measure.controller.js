sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, Utilities, History) {
	"use strict";
	var t0;
	var t1;
	var total = 0;
	return BaseController.extend("com.sap.build.standard.inventoryDashboard.controller.Measure", {
		handleRouteMatched: function (oEvent) {
			var sAppId = "App5fbfb3ab5925980d687689d1";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function (oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype" && prop.includes("Set")) {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			if (!this.sContext) {
				this.sContext = "MachinesSet('E1')";
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		_onSegmentedButtonItemPress: function (oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function (fnResolve) {

				this.doNavigate("Dashboard", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet,
					sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		_onButtonPressI1: function () {
			return new Promise(function (fnResolve) {
				var aChangedEntitiesPath, oChangedBindingContext;
				var oModel = this.oModel;
				this.getView().byId("ph1-txt").setValue("0.0");
				t0 = performance.now();

				if (oModel && oModel.hasPendingChanges()) {
					aChangedEntitiesPath = Object.keys(oModel.mChangedEntities);

					for (var j = 0; j < aChangedEntitiesPath.length; j++) {
						oChangedBindingContext = oModel.getContext("/" + aChangedEntitiesPath[j]);
						if (oChangedBindingContext && oChangedBindingContext.bCreated) {
							oModel.deleteCreatedEntry(oChangedBindingContext);
						}
					}
					oModel.resetChanges();
				}
				fnResolve();
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onButtonPressT1: function () {
			return new Promise(function (fnResolve) {
				var aChangedEntitiesPath, oChangedBindingContext;
				var oModel = this.oModel;
				t1 = performance.now();
				this.getView().byId("ph1-txt").setValue(((t1 - t0) / 1000).toFixed(2) + " segundos");
				total += (t1 - t0);
				this.getView().byId("total-txt").setValue((total / 1000).toFixed(2) + " segundos");
				this.getView().byId("btnI1").setEnabled(false);
				this.getView().byId("btnT1").setEnabled(false);
				this.getView().byId("btnI2").setEnabled(true);
				this.getView().byId("btnT2").setEnabled(true);
				
				if (oModel && oModel.hasPendingChanges()) {
					aChangedEntitiesPath = Object.keys(oModel.mChangedEntities);

					for (var j = 0; j < aChangedEntitiesPath.length; j++) {
						oChangedBindingContext = oModel.getContext("/" + aChangedEntitiesPath[j]);
						if (oChangedBindingContext && oChangedBindingContext.bCreated) {
							oModel.deleteCreatedEntry(oChangedBindingContext);
						}
					}
					oModel.resetChanges();
				}
				fnResolve();
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onButtonPressI2: function () {
			return new Promise(function (fnResolve) {
				var aChangedEntitiesPath, oChangedBindingContext;
				var oModel = this.oModel;
				this.getView().byId("ph2-txt").setValue("0.0");
				t0 = performance.now();

				if (oModel && oModel.hasPendingChanges()) {
					aChangedEntitiesPath = Object.keys(oModel.mChangedEntities);

					for (var j = 0; j < aChangedEntitiesPath.length; j++) {
						oChangedBindingContext = oModel.getContext("/" + aChangedEntitiesPath[j]);
						if (oChangedBindingContext && oChangedBindingContext.bCreated) {
							oModel.deleteCreatedEntry(oChangedBindingContext);
						}
					}
					oModel.resetChanges();
				}
				fnResolve();
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});
		},
			_onButtonPressT2: function () {
			return new Promise(function (fnResolve) {
				var aChangedEntitiesPath, oChangedBindingContext;
				var oModel = this.oModel;
				t1 = performance.now();
				this.getView().byId("ph2-txt").setValue(((t1 - t0) / 1000).toFixed(2) + " segundos");
				total += (t1 - t0);
				this.getView().byId("total-txt").setValue((total / 1000).toFixed(2) + " segundos");
				this.getView().byId("btnI2").setEnabled(false);
				this.getView().byId("btnT2").setEnabled(false);
				this.getView().byId("btnI3").setEnabled(true);
				this.getView().byId("btnT3").setEnabled(true);
				
				if (oModel && oModel.hasPendingChanges()) {
					aChangedEntitiesPath = Object.keys(oModel.mChangedEntities);

					for (var j = 0; j < aChangedEntitiesPath.length; j++) {
						oChangedBindingContext = oModel.getContext("/" + aChangedEntitiesPath[j]);
						if (oChangedBindingContext && oChangedBindingContext.bCreated) {
							oModel.deleteCreatedEntry(oChangedBindingContext);
						}
					}
					oModel.resetChanges();
				}
				fnResolve();
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onButtonPressI3: function () {
			return new Promise(function (fnResolve) {
				var aChangedEntitiesPath, oChangedBindingContext;
				var oModel = this.oModel;
				this.getView().byId("ph3-txt").setValue("0.0");
				t0 = performance.now();

				if (oModel && oModel.hasPendingChanges()) {
					aChangedEntitiesPath = Object.keys(oModel.mChangedEntities);

					for (var j = 0; j < aChangedEntitiesPath.length; j++) {
						oChangedBindingContext = oModel.getContext("/" + aChangedEntitiesPath[j]);
						if (oChangedBindingContext && oChangedBindingContext.bCreated) {
							oModel.deleteCreatedEntry(oChangedBindingContext);
						}
					}
					oModel.resetChanges();
				}
				fnResolve();
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});
		},
			_onButtonPressT3: function () {
			return new Promise(function (fnResolve) {
				var aChangedEntitiesPath, oChangedBindingContext;
				var oModel = this.oModel;
				t1 = performance.now();
				this.getView().byId("ph3-txt").setValue(((t1 - t0) / 1000).toFixed(2) + " segundos");
				total += (t1 - t0);
				this.getView().byId("total-txt").setValue((total / 1000).toFixed(2) + " segundos");
				this.getView().byId("btnI3").setEnabled(false);
				this.getView().byId("btnT3").setEnabled(false);
				this.getView().byId("btnI4").setEnabled(true);
				this.getView().byId("btnT4").setEnabled(true);
				
				if (oModel && oModel.hasPendingChanges()) {
					aChangedEntitiesPath = Object.keys(oModel.mChangedEntities);

					for (var j = 0; j < aChangedEntitiesPath.length; j++) {
						oChangedBindingContext = oModel.getContext("/" + aChangedEntitiesPath[j]);
						if (oChangedBindingContext && oChangedBindingContext.bCreated) {
							oModel.deleteCreatedEntry(oChangedBindingContext);
						}
					}
					oModel.resetChanges();
				}
				fnResolve();
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onButtonPressI4: function () {
			return new Promise(function (fnResolve) {
				var aChangedEntitiesPath, oChangedBindingContext;
				var oModel = this.oModel;
				this.getView().byId("ph4-txt").setValue("0.0");
				t0 = performance.now();

				if (oModel && oModel.hasPendingChanges()) {
					aChangedEntitiesPath = Object.keys(oModel.mChangedEntities);

					for (var j = 0; j < aChangedEntitiesPath.length; j++) {
						oChangedBindingContext = oModel.getContext("/" + aChangedEntitiesPath[j]);
						if (oChangedBindingContext && oChangedBindingContext.bCreated) {
							oModel.deleteCreatedEntry(oChangedBindingContext);
						}
					}
					oModel.resetChanges();
				}
				fnResolve();
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});
		},
			_onButtonPressT4: function () {
			return new Promise(function (fnResolve) {
				var aChangedEntitiesPath, oChangedBindingContext;
				var oModel = this.oModel;
				t1 = performance.now();
				this.getView().byId("ph4-txt").setValue(((t1 - t0) / 1000).toFixed(2) + " segundos");
				total += (t1 - t0);
				this.getView().byId("total-txt").setValue((total / 1000).toFixed(2) + " segundos");
				this.getView().byId("btnI4").setEnabled(false);
				this.getView().byId("btnT4").setEnabled(false);
				this.getView().byId("btnI5").setEnabled(true);
				this.getView().byId("btnT5").setEnabled(true);
				
				if (oModel && oModel.hasPendingChanges()) {
					aChangedEntitiesPath = Object.keys(oModel.mChangedEntities);

					for (var j = 0; j < aChangedEntitiesPath.length; j++) {
						oChangedBindingContext = oModel.getContext("/" + aChangedEntitiesPath[j]);
						if (oChangedBindingContext && oChangedBindingContext.bCreated) {
							oModel.deleteCreatedEntry(oChangedBindingContext);
						}
					}
					oModel.resetChanges();
				}
				fnResolve();
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		_onButtonPressI5: function () {
			return new Promise(function (fnResolve) {
				var aChangedEntitiesPath, oChangedBindingContext;
				var oModel = this.oModel;
				this.getView().byId("ph5-txt").setValue("0.0");
				t0 = performance.now();

				if (oModel && oModel.hasPendingChanges()) {
					aChangedEntitiesPath = Object.keys(oModel.mChangedEntities);

					for (var j = 0; j < aChangedEntitiesPath.length; j++) {
						oChangedBindingContext = oModel.getContext("/" + aChangedEntitiesPath[j]);
						if (oChangedBindingContext && oChangedBindingContext.bCreated) {
							oModel.deleteCreatedEntry(oChangedBindingContext);
						}
					}
					oModel.resetChanges();
				}
				fnResolve();
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});
		},
			_onButtonPressT5: function () {
			return new Promise(function (fnResolve) {
				var aChangedEntitiesPath, oChangedBindingContext;
				var oModel = this.oModel;
				t1 = performance.now();
				this.getView().byId("ph5-txt").setValue(((t1 - t0) / 1000).toFixed(2) + " segundos");
				total += (t1 - t0);
				this.getView().byId("total-txt").setValue((total / 1000).toFixed(2) + " segundos");
				this.getView().byId("btnI5").setEnabled(false);
				this.getView().byId("btnT5").setEnabled(false);
				this.getView().byId("btnSave").setEnabled(true);
				this.getView().byId("btnDelete").setEnabled(true);
				
				
				if (oModel && oModel.hasPendingChanges()) {
					aChangedEntitiesPath = Object.keys(oModel.mChangedEntities);

					for (var j = 0; j < aChangedEntitiesPath.length; j++) {
						oChangedBindingContext = oModel.getContext("/" + aChangedEntitiesPath[j]);
						if (oChangedBindingContext && oChangedBindingContext.bCreated) {
							oModel.deleteCreatedEntry(oChangedBindingContext);
						}
					}
					oModel.resetChanges();
				}
				fnResolve();
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});
		},
			_onSegmentedPressDelete: function () {
			return new Promise(function (fnResolve) {
				var aChangedEntitiesPath, oChangedBindingContext;
				var oModel = this.oModel;
				this.getView().byId("ph1-txt").setValue("");
				this.getView().byId("ph2-txt").setValue("");
				this.getView().byId("ph3-txt").setValue("");
				this.getView().byId("ph4-txt").setValue("");
				this.getView().byId("ph5-txt").setValue("");
				this.getView().byId("total-txt").setValue("");
				this.getView().byId("btnSave").setEnabled(false);
				this.getView().byId("btnI1").setEnabled(true);
				this.getView().byId("btnT1").setEnabled(true);
				this.getView().byId("btnI2").setEnabled(false);
				this.getView().byId("btnT2").setEnabled(false);
				this.getView().byId("btnI3").setEnabled(false);
				this.getView().byId("btnT3").setEnabled(false);
				this.getView().byId("btnI4").setEnabled(false);
				this.getView().byId("btnT4").setEnabled(false);
				this.getView().byId("btnI5").setEnabled(false);
				this.getView().byId("btnT5").setEnabled(false);
				
				if (oModel && oModel.hasPendingChanges()) {
					aChangedEntitiesPath = Object.keys(oModel.mChangedEntities);

					for (var j = 0; j < aChangedEntitiesPath.length; j++) {
						oChangedBindingContext = oModel.getContext("/" + aChangedEntitiesPath[j]);
						if (oChangedBindingContext && oChangedBindingContext.bCreated) {
							oModel.deleteCreatedEntry(oChangedBindingContext);
						}
					}
					oModel.resetChanges();
				}
				
				fnResolve();
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});
		}, 
			_onSegmentedPressSave: function () {
			return new Promise(function (fnResolve) {
				var aChangedEntitiesPath, oChangedBindingContext;
				var oModel = this.oModel;
				this.getView().byId("ph1-txt").setValue("");
				this.getView().byId("ph2-txt").setValue("");
				this.getView().byId("ph3-txt").setValue("");
				this.getView().byId("ph4-txt").setValue("");
				this.getView().byId("ph5-txt").setValue("");
				this.getView().byId("total-txt").setValue("");
				this.getView().byId("btnI1").setEnabled(true);
				this.getView().byId("btnT1").setEnabled(true);
				this.getView().byId("btnI2").setEnabled(false);
				this.getView().byId("btnT2").setEnabled(false);
				this.getView().byId("btnI3").setEnabled(false);
				this.getView().byId("btnT3").setEnabled(false);
				this.getView().byId("btnI4").setEnabled(false);
				this.getView().byId("btnT4").setEnabled(false);
				this.getView().byId("btnI5").setEnabled(false);
				this.getView().byId("btnT5").setEnabled(false);
				
				if (oModel && oModel.hasPendingChanges()) {
					aChangedEntitiesPath = Object.keys(oModel.mChangedEntities);

					for (var j = 0; j < aChangedEntitiesPath.length; j++) {
						oChangedBindingContext = oModel.getContext("/" + aChangedEntitiesPath[j]);
						if (oChangedBindingContext && oChangedBindingContext.bCreated) {
							oModel.deleteCreatedEntry(oChangedBindingContext);
						}
					}
					oModel.resetChanges();
				}
				
				fnResolve();
			}.bind(this)).catch(function (err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});
		}, 
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Measure").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function () {
					if (sap.ui.Device.system.phone) {
						var oPage = oView.getContent()[0];
						if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
							oPage.setShowNavButton(true);
							oPage.attachNavButtonPress(function () {
								this.oRouter.navTo("Dashboard", {}, true);
							}.bind(this));
						}
					}
				}.bind(this)
			});

			this.oModel = this.getOwnerComponent().getModel();

		}
	});
}, /* bExport= */ true);