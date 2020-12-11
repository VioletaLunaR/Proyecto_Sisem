sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (BaseController, MessageBox, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.inventoryDashboard.controller.Dashboard", {
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

				this.doNavigate("Measure", oBindingContext, fnResolve, "");
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
		_onButtonPress: function (oEvent) {

			this.mSettingsDialogs = this.mSettingsDialogs || {};
			var sSourceId = oEvent.getSource().getId();
			var oDialog = this.mSettingsDialogs["ViewSettingsDialog1"];

			var confirmHandler = function (oConfirmEvent) {
				var self = this;
				var sFilterString = oConfirmEvent.getParameter('filterString');
				var oBindingData = {};

				/* Filtering */
				oBindingData.filters = [];
				// The list of filters that will be applied to the collection
				var oFilter;
				var vValueLT, vValueGT;

				vValueLT = oDialog.getModel().getProperty("/date/vValueLT");
				vValueGT = oDialog.getModel().getProperty("/date/vValueGT");
				if (vValueLT !== "" || vValueGT !== "") {
					oFilter = this.getCustomFilter("date", vValueLT, vValueGT);
					oBindingData.filters.push(oFilter);
					sFilterString = sFilterString ? sFilterString + ', ' : 'Filtered by: ';
					sFilterString += this.getCustomFilterString(false, "date", oFilter.sOperator, vValueLT, vValueGT);
				}

				vValueLT = oDialog.getModel().getProperty("/phase1/vValueLT");
				vValueGT = oDialog.getModel().getProperty("/phase1/vValueGT");
				if (vValueLT !== "" || vValueGT !== "") {
					oFilter = this.getCustomFilter("phase1", vValueLT, vValueGT);
					oBindingData.filters.push(oFilter);
					sFilterString = sFilterString ? sFilterString + ', ' : 'Filtered by: ';
					sFilterString += this.getCustomFilterString(true, "phase1", oFilter.sOperator, vValueLT, vValueGT);
				}

				vValueLT = oDialog.getModel().getProperty("/phase2/vValueLT");
				vValueGT = oDialog.getModel().getProperty("/phase2/vValueGT");
				if (vValueLT !== "" || vValueGT !== "") {
					oFilter = this.getCustomFilter("phase2", vValueLT, vValueGT);
					oBindingData.filters.push(oFilter);
					sFilterString = sFilterString ? sFilterString + ', ' : 'Filtered by: ';
					sFilterString += this.getCustomFilterString(true, "phase2", oFilter.sOperator, vValueLT, vValueGT);
				}

				vValueLT = oDialog.getModel().getProperty("/phase3/vValueLT");
				vValueGT = oDialog.getModel().getProperty("/phase3/vValueGT");
				if (vValueLT !== "" || vValueGT !== "") {
					oFilter = this.getCustomFilter("phase3", vValueLT, vValueGT);
					oBindingData.filters.push(oFilter);
					sFilterString = sFilterString ? sFilterString + ', ' : 'Filtered by: ';
					sFilterString += this.getCustomFilterString(true, "phase3", oFilter.sOperator, vValueLT, vValueGT);
				}

				vValueLT = oDialog.getModel().getProperty("/phase4/vValueLT");
				vValueGT = oDialog.getModel().getProperty("/phase4/vValueGT");
				if (vValueLT !== "" || vValueGT !== "") {
					oFilter = this.getCustomFilter("phase4", vValueLT, vValueGT);
					oBindingData.filters.push(oFilter);
					sFilterString = sFilterString ? sFilterString + ', ' : 'Filtered by: ';
					sFilterString += this.getCustomFilterString(true, "phase4", oFilter.sOperator, vValueLT, vValueGT);
				}

				vValueLT = oDialog.getModel().getProperty("/phase5/vValueLT");
				vValueGT = oDialog.getModel().getProperty("/phase5/vValueGT");
				if (vValueLT !== "" || vValueGT !== "") {
					oFilter = this.getCustomFilter("phase5", vValueLT, vValueGT);
					oBindingData.filters.push(oFilter);
					sFilterString = sFilterString ? sFilterString + ', ' : 'Filtered by: ';
					sFilterString += this.getCustomFilterString(true, "phase5", oFilter.sOperator, vValueLT, vValueGT);
				}

				// Simple filters (String)
				var mSimpleFilters = {},
					sKey;
				for (sKey in oConfirmEvent.getParameter("filterKeys")) {
					var aSplit = sKey.split("___");
					var sPath = aSplit[1];
					var sValue1 = aSplit[2];
					var oFilterInfo = new sap.ui.model.Filter(sPath, "EQ", sValue1);

					// Creating a map of filters for each path
					if (!mSimpleFilters[sPath]) {
						mSimpleFilters[sPath] = [oFilterInfo];
					} else {
						mSimpleFilters[sPath].push(oFilterInfo);
					}
				}

				for (var path in mSimpleFilters) {
					// All filters on a same path are combined with a OR
					oBindingData.filters.push(new sap.ui.model.Filter(mSimpleFilters[path], false));
				}

				aCollections.forEach(function (oCollectionItem) {
					var oCollection = self.getView().byId(oCollectionItem.id);
					var oBindingInfo = oCollection.getBindingInfo(oCollectionItem.aggregation);
					var oBindingOptions = this.updateBindingOptions(oCollectionItem.id, oBindingData, sSourceId);
					if (oBindingInfo.model === "kpiModel") {
						oCollection.getObjectBinding().refresh();
					} else {
						oCollection.bindAggregation(oCollectionItem.aggregation, {
							model: oBindingInfo.model,
							path: oBindingInfo.path,
							parameters: oBindingInfo.parameters,
							template: oBindingInfo.template,
							templateShareable: true,
							sorter: oBindingOptions.sorters,
							filters: oBindingOptions.filters
						});
					}

					// Display the filter string if necessary
					if (typeof oCollection.getInfoToolbar === "function") {
						var oToolBar = oCollection.getInfoToolbar();
						if (oToolBar && oToolBar.getContent().length === 1) {
							oToolBar.setVisible(!!sFilterString);
							oToolBar.getContent()[0].setText(sFilterString);
						}
					}
				}, this);
			}.bind(this);

			function resetFiltersHandler() {

				oDialog.getModel().setProperty("/date/vValueLT", "");
				oDialog.getModel().setProperty("/date/vValueGT", "");

				oDialog.getModel().setProperty("/phase1/vValueLT", "");
				oDialog.getModel().setProperty("/phase1/vValueGT", "");

				oDialog.getModel().setProperty("/phase2/vValueLT", "");
				oDialog.getModel().setProperty("/phase2/vValueGT", "");

				oDialog.getModel().setProperty("/phase3/vValueLT", "");
				oDialog.getModel().setProperty("/phase3/vValueGT", "");

				oDialog.getModel().setProperty("/phase4/vValueLT", "");
				oDialog.getModel().setProperty("/phase4/vValueGT", "");

				oDialog.getModel().setProperty("/phase5/vValueLT", "");
				oDialog.getModel().setProperty("/phase5/vValueGT", "");

			}

			function updateDialogData(filters) {
				var mParams = {
					context: oReferenceCollection.getBindingContext(),
					success: function (oData) {
						var oJsonModelDialogData = {};
						// Loop through each entity
						oData.results.forEach(function (oEntity) {
							// Add the distinct properties in a map
							for (var oKey in oEntity) {
								if (!oJsonModelDialogData[oKey]) {
									oJsonModelDialogData[oKey] = [oEntity[oKey]];
								} else if (oJsonModelDialogData[oKey].indexOf(oEntity[oKey]) === -1) {
									oJsonModelDialogData[oKey].push(oEntity[oKey]);
								}
							}
						});

						var oDialogModel = oDialog.getModel();

						oJsonModelDialogData["date"] = {
							vValueLT: (oDialogModel && oDialogModel.getProperty("/date")) ? oDialogModel.getProperty("/date/vValueLT") : "",
							vValueGT: (oDialogModel && oDialogModel.getProperty("/date")) ? oDialogModel.getProperty("/date/vValueGT") : ""
						};

						oJsonModelDialogData["phase1"] = {
							vValueLT: (oDialogModel && oDialogModel.getProperty("/phase1")) ? oDialogModel.getProperty("/phase1/vValueLT") : "",
							vValueGT: (oDialogModel && oDialogModel.getProperty("/phase1")) ? oDialogModel.getProperty("/phase1/vValueGT") : ""
						};

						oJsonModelDialogData["phase2"] = {
							vValueLT: (oDialogModel && oDialogModel.getProperty("/phase2")) ? oDialogModel.getProperty("/phase2/vValueLT") : "",
							vValueGT: (oDialogModel && oDialogModel.getProperty("/phase2")) ? oDialogModel.getProperty("/phase2/vValueGT") : ""
						};

						oJsonModelDialogData["phase3"] = {
							vValueLT: (oDialogModel && oDialogModel.getProperty("/phase3")) ? oDialogModel.getProperty("/phase3/vValueLT") : "",
							vValueGT: (oDialogModel && oDialogModel.getProperty("/phase3")) ? oDialogModel.getProperty("/phase3/vValueGT") : ""
						};

						oJsonModelDialogData["phase4"] = {
							vValueLT: (oDialogModel && oDialogModel.getProperty("/phase4")) ? oDialogModel.getProperty("/phase4/vValueLT") : "",
							vValueGT: (oDialogModel && oDialogModel.getProperty("/phase4")) ? oDialogModel.getProperty("/phase4/vValueGT") : ""
						};

						oJsonModelDialogData["phase5"] = {
							vValueLT: (oDialogModel && oDialogModel.getProperty("/phase5")) ? oDialogModel.getProperty("/phase5/vValueLT") : "",
							vValueGT: (oDialogModel && oDialogModel.getProperty("/phase5")) ? oDialogModel.getProperty("/phase5/vValueGT") : ""
						};

						if (!oDialogModel) {
							oDialogModel = new sap.ui.model.json.JSONModel();
							oDialog.setModel(oDialogModel);
						}
						oDialogModel.setData(oJsonModelDialogData);
						oDialog.open();
					}
				};
				var sPath;
				var sModelName = oReferenceCollection.getBindingInfo(aCollections[0].aggregation).model;
				// In KPI mode for charts, getBindingInfo would return the local JSONModel
				if (sModelName === "kpiModel") {
					sPath = oReferenceCollection.getObjectBinding().getPath();
				} else {
					sPath = oReferenceCollection.getBindingInfo(aCollections[0].aggregation).path;
				}
				mParams.filters = filters;
				oModel.read(sPath, mParams);
			}

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment({
					fragmentName: "com.sap.build.standard.inventoryDashboard.view.ViewSettingsDialog1"
				}, this);
				oDialog.attachEvent("confirm", confirmHandler);
				oDialog.attachEvent("resetFilters", resetFiltersHandler);

				this.mSettingsDialogs["ViewSettingsDialog1"] = oDialog;
			}

			var aCollections = [];

			aCollections.push({
				id: "sap_IconTabBar_Page_0-content-sap_chart_StackedColumnChart-1606414724064",
				aggregation: "data"
			});

			var oReferenceCollection = this.getView().byId(aCollections[0].id);
			var oSourceBindingContext = oReferenceCollection.getBindingContext();
			var oModel = oSourceBindingContext ? oSourceBindingContext.getModel() : this.getView().getModel();

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
			var designTimeFilters = this.mBindingOptions && this.mBindingOptions[aCollections[0].id] && this.mBindingOptions[aCollections[0].id]
				.filters && this.mBindingOptions[aCollections[0].id].filters[undefined];
			updateDialogData(designTimeFilters);

		},
		updateBindingOptions: function (sCollectionId, oBindingData, sSourceId) {
			this.mBindingOptions = this.mBindingOptions || {};
			this.mBindingOptions[sCollectionId] = this.mBindingOptions[sCollectionId] || {};

			var aSorters = this.mBindingOptions[sCollectionId].sorters;
			var aGroupby = this.mBindingOptions[sCollectionId].groupby;

			// If there is no oBindingData parameter, we just need the processed filters and sorters from this function
			if (oBindingData) {
				if (oBindingData.sorters) {
					aSorters = oBindingData.sorters;
				}
				if (oBindingData.groupby || oBindingData.groupby === null) {
					aGroupby = oBindingData.groupby;
				}
				// 1) Update the filters map for the given collection and source
				this.mBindingOptions[sCollectionId].sorters = aSorters;
				this.mBindingOptions[sCollectionId].groupby = aGroupby;
				this.mBindingOptions[sCollectionId].filters = this.mBindingOptions[sCollectionId].filters || {};
				this.mBindingOptions[sCollectionId].filters[sSourceId] = oBindingData.filters || [];
			}

			// 2) Reapply all the filters and sorters
			var aFilters = [];
			for (var key in this.mBindingOptions[sCollectionId].filters) {
				aFilters = aFilters.concat(this.mBindingOptions[sCollectionId].filters[key]);
			}

			// Add the groupby first in the sorters array
			if (aGroupby) {
				aSorters = aSorters ? aGroupby.concat(aSorters) : aGroupby;
			}

			var aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, true)] : undefined;
			return {
				filters: aFinalFilters,
				sorters: aSorters
			};

		},
		getCustomFilter: function (sPath, vValueLT, vValueGT) {
			if (vValueLT !== "" && vValueGT !== "") {
				return new sap.ui.model.Filter([
					new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.GT, vValueGT),
					new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.LT, vValueLT)
				], true);
			}
			if (vValueLT !== "") {
				return new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.LT, vValueLT);
			}
			return new sap.ui.model.Filter(sPath, sap.ui.model.FilterOperator.GT, vValueGT);

		},
		getCustomFilterString: function (bIsNumber, sPath, sOperator, vValueLT, vValueGT) {
			switch (sOperator) {
			case sap.ui.model.FilterOperator.LT:
				return sPath + (bIsNumber ? ' (Less than ' : ' (Before ') + vValueLT + ')';
			case sap.ui.model.FilterOperator.GT:
				return sPath + (bIsNumber ? ' (More than ' : ' (After ') + vValueGT + ')';
			default:
				if (bIsNumber) {
					return sPath + ' (More than ' + vValueGT + ' and less than ' + vValueLT + ')';
				}
				return sPath + ' (After ' + vValueGT + ' and before ' + vValueLT + ')';
			}

		},
		filterCountFormatter: function (sValue1, sValue2) {
			return sValue1 !== "" || sValue2 !== "" ? 1 : 0;

		},
		_onButtonPress1: function (oEvent) {

			this.mSettingsDialogs = this.mSettingsDialogs || {};
			var sSourceId = oEvent.getSource().getId();
			var oDialog = this.mSettingsDialogs["ViewSettingsDialog2"];

			var confirmHandler = function (oConfirmEvent) {
				var self = this;
				var sFilterString = oConfirmEvent.getParameter('filterString');
				var oBindingData = {};

				/* Sorting */
				if (oConfirmEvent.getParameter("sortItem")) {
					var sPath = oConfirmEvent.getParameter("sortItem").getKey();
					oBindingData.sorters = [new sap.ui.model.Sorter(sPath, oConfirmEvent.getParameter("sortDescending"))];
				}

				aCollections.forEach(function (oCollectionItem) {
					var oCollection = self.getView().byId(oCollectionItem.id);
					var oBindingInfo = oCollection.getBindingInfo(oCollectionItem.aggregation);
					var oBindingOptions = this.updateBindingOptions(oCollectionItem.id, oBindingData, sSourceId);
					if (oBindingInfo.model === "kpiModel") {
						oCollection.getObjectBinding().refresh();
					} else {
						oCollection.bindAggregation(oCollectionItem.aggregation, {
							model: oBindingInfo.model,
							path: oBindingInfo.path,
							parameters: oBindingInfo.parameters,
							template: oBindingInfo.template,
							templateShareable: true,
							sorter: oBindingOptions.sorters,
							filters: oBindingOptions.filters
						});
					}

					// Display the filter string if necessary
					if (typeof oCollection.getInfoToolbar === "function") {
						var oToolBar = oCollection.getInfoToolbar();
						if (oToolBar && oToolBar.getContent().length === 1) {
							oToolBar.setVisible(!!sFilterString);
							oToolBar.getContent()[0].setText(sFilterString);
						}
					}
				}, this);
			}.bind(this);

			function resetFiltersHandler() {

				oDialog.getModel().setProperty("/date/vValueLT", "");
				oDialog.getModel().setProperty("/date/vValueGT", "");

				oDialog.getModel().setProperty("/phase1/vValueLT", "");
				oDialog.getModel().setProperty("/phase1/vValueGT", "");

				oDialog.getModel().setProperty("/phase2/vValueLT", "");
				oDialog.getModel().setProperty("/phase2/vValueGT", "");

				oDialog.getModel().setProperty("/phase3/vValueLT", "");
				oDialog.getModel().setProperty("/phase3/vValueGT", "");

				oDialog.getModel().setProperty("/phase4/vValueLT", "");
				oDialog.getModel().setProperty("/phase4/vValueGT", "");

				oDialog.getModel().setProperty("/phase5/vValueLT", "");
				oDialog.getModel().setProperty("/phase5/vValueGT", "");

			}

			function updateDialogData(filters) {
				var mParams = {
					context: oReferenceCollection.getBindingContext(),
					success: function (oData) {
						var oJsonModelDialogData = {};
						// Loop through each entity
						oData.results.forEach(function (oEntity) {
							// Add the distinct properties in a map
							for (var oKey in oEntity) {
								if (!oJsonModelDialogData[oKey]) {
									oJsonModelDialogData[oKey] = [oEntity[oKey]];
								} else if (oJsonModelDialogData[oKey].indexOf(oEntity[oKey]) === -1) {
									oJsonModelDialogData[oKey].push(oEntity[oKey]);
								}
							}
						});

						var oDialogModel = oDialog.getModel();

						oJsonModelDialogData["date"] = {
							vValueLT: (oDialogModel && oDialogModel.getProperty("/date")) ? oDialogModel.getProperty("/date/vValueLT") : "",
							vValueGT: (oDialogModel && oDialogModel.getProperty("/date")) ? oDialogModel.getProperty("/date/vValueGT") : ""
						};

						oJsonModelDialogData["phase1"] = {
							vValueLT: (oDialogModel && oDialogModel.getProperty("/phase1")) ? oDialogModel.getProperty("/phase1/vValueLT") : "",
							vValueGT: (oDialogModel && oDialogModel.getProperty("/phase1")) ? oDialogModel.getProperty("/phase1/vValueGT") : ""
						};

						oJsonModelDialogData["phase2"] = {
							vValueLT: (oDialogModel && oDialogModel.getProperty("/phase2")) ? oDialogModel.getProperty("/phase2/vValueLT") : "",
							vValueGT: (oDialogModel && oDialogModel.getProperty("/phase2")) ? oDialogModel.getProperty("/phase2/vValueGT") : ""
						};

						oJsonModelDialogData["phase3"] = {
							vValueLT: (oDialogModel && oDialogModel.getProperty("/phase3")) ? oDialogModel.getProperty("/phase3/vValueLT") : "",
							vValueGT: (oDialogModel && oDialogModel.getProperty("/phase3")) ? oDialogModel.getProperty("/phase3/vValueGT") : ""
						};

						oJsonModelDialogData["phase4"] = {
							vValueLT: (oDialogModel && oDialogModel.getProperty("/phase4")) ? oDialogModel.getProperty("/phase4/vValueLT") : "",
							vValueGT: (oDialogModel && oDialogModel.getProperty("/phase4")) ? oDialogModel.getProperty("/phase4/vValueGT") : ""
						};

						oJsonModelDialogData["phase5"] = {
							vValueLT: (oDialogModel && oDialogModel.getProperty("/phase5")) ? oDialogModel.getProperty("/phase5/vValueLT") : "",
							vValueGT: (oDialogModel && oDialogModel.getProperty("/phase5")) ? oDialogModel.getProperty("/phase5/vValueGT") : ""
						};

						if (!oDialogModel) {
							oDialogModel = new sap.ui.model.json.JSONModel();
							oDialog.setModel(oDialogModel);
						}
						oDialogModel.setData(oJsonModelDialogData);
						oDialog.open();
					}
				};
				var sPath;
				var sModelName = oReferenceCollection.getBindingInfo(aCollections[0].aggregation).model;
				// In KPI mode for charts, getBindingInfo would return the local JSONModel
				if (sModelName === "kpiModel") {
					sPath = oReferenceCollection.getObjectBinding().getPath();
				} else {
					sPath = oReferenceCollection.getBindingInfo(aCollections[0].aggregation).path;
				}
				mParams.filters = filters;
				oModel.read(sPath, mParams);
			}

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment({
					fragmentName: "com.sap.build.standard.inventoryDashboard.view.ViewSettingsDialog2"
				}, this);
				oDialog.attachEvent("confirm", confirmHandler);
				oDialog.attachEvent("resetFilters", resetFiltersHandler);

				this.mSettingsDialogs["ViewSettingsDialog2"] = oDialog;
			}

			var aCollections = [];

			aCollections.push({
				id: "sap_IconTabBar_Page_0-content-sap_chart_StackedColumnChart-1606414724064",
				aggregation: "data"
			});

			var oReferenceCollection = this.getView().byId(aCollections[0].id);
			var oSourceBindingContext = oReferenceCollection.getBindingContext();
			var oModel = oSourceBindingContext ? oSourceBindingContext.getModel() : this.getView().getModel();

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
			var designTimeFilters = this.mBindingOptions && this.mBindingOptions[aCollections[0].id] && this.mBindingOptions[aCollections[0].id]
				.filters && this.mBindingOptions[aCollections[0].id].filters[undefined];
			updateDialogData(designTimeFilters);

		},
		_onButtonPress2: function (oEvent) {

			this.mSettingsDialogs = this.mSettingsDialogs || {};
			var sSourceId = oEvent.getSource().getId();
			var oDialog = this.mSettingsDialogs["ViewSettingsDialog3"];

			var confirmHandler = function (oConfirmEvent) {
				var self = this;
				var sFilterString = oConfirmEvent.getParameter('filterString');
				var oBindingData = {};

				/* Grouping */
				if (oConfirmEvent.getParameter("groupItem")) {
					var sPath = oConfirmEvent.getParameter("groupItem").getKey();
					oBindingData.groupby = [new sap.ui.model.Sorter(sPath, oConfirmEvent.getParameter("groupDescending"), true)];
				} else {
					// Reset the group by
					oBindingData.groupby = null;
				}

				aCollections.forEach(function (oCollectionItem) {
					var oCollection = self.getView().byId(oCollectionItem.id);
					var oBindingInfo = oCollection.getBindingInfo(oCollectionItem.aggregation);
					var oBindingOptions = this.updateBindingOptions(oCollectionItem.id, oBindingData, sSourceId);
					if (oBindingInfo.model === "kpiModel") {
						oCollection.getObjectBinding().refresh();
					} else {
						oCollection.bindAggregation(oCollectionItem.aggregation, {
							model: oBindingInfo.model,
							path: oBindingInfo.path,
							parameters: oBindingInfo.parameters,
							template: oBindingInfo.template,
							templateShareable: true,
							sorter: oBindingOptions.sorters,
							filters: oBindingOptions.filters
						});
					}

					// Display the filter string if necessary
					if (typeof oCollection.getInfoToolbar === "function") {
						var oToolBar = oCollection.getInfoToolbar();
						if (oToolBar && oToolBar.getContent().length === 1) {
							oToolBar.setVisible(!!sFilterString);
							oToolBar.getContent()[0].setText(sFilterString);
						}
					}
				}, this);
			}.bind(this);

			function resetFiltersHandler() {

				oDialog.getModel().setProperty("/date/vValueLT", "");
				oDialog.getModel().setProperty("/date/vValueGT", "");

				oDialog.getModel().setProperty("/phase1/vValueLT", "");
				oDialog.getModel().setProperty("/phase1/vValueGT", "");

				oDialog.getModel().setProperty("/phase2/vValueLT", "");
				oDialog.getModel().setProperty("/phase2/vValueGT", "");

				oDialog.getModel().setProperty("/phase3/vValueLT", "");
				oDialog.getModel().setProperty("/phase3/vValueGT", "");

				oDialog.getModel().setProperty("/phase4/vValueLT", "");
				oDialog.getModel().setProperty("/phase4/vValueGT", "");

				oDialog.getModel().setProperty("/phase5/vValueLT", "");
				oDialog.getModel().setProperty("/phase5/vValueGT", "");

			}

			function updateDialogData(filters) {
				var mParams = {
					context: oReferenceCollection.getBindingContext(),
					success: function (oData) {
						var oJsonModelDialogData = {};
						// Loop through each entity
						oData.results.forEach(function (oEntity) {
							// Add the distinct properties in a map
							for (var oKey in oEntity) {
								if (!oJsonModelDialogData[oKey]) {
									oJsonModelDialogData[oKey] = [oEntity[oKey]];
								} else if (oJsonModelDialogData[oKey].indexOf(oEntity[oKey]) === -1) {
									oJsonModelDialogData[oKey].push(oEntity[oKey]);
								}
							}
						});

						var oDialogModel = oDialog.getModel();

						oJsonModelDialogData["date"] = {
							vValueLT: (oDialogModel && oDialogModel.getProperty("/date")) ? oDialogModel.getProperty("/date/vValueLT") : "",
							vValueGT: (oDialogModel && oDialogModel.getProperty("/date")) ? oDialogModel.getProperty("/date/vValueGT") : ""
						};

						oJsonModelDialogData["phase1"] = {
							vValueLT: (oDialogModel && oDialogModel.getProperty("/phase1")) ? oDialogModel.getProperty("/phase1/vValueLT") : "",
							vValueGT: (oDialogModel && oDialogModel.getProperty("/phase1")) ? oDialogModel.getProperty("/phase1/vValueGT") : ""
						};

						oJsonModelDialogData["phase2"] = {
							vValueLT: (oDialogModel && oDialogModel.getProperty("/phase2")) ? oDialogModel.getProperty("/phase2/vValueLT") : "",
							vValueGT: (oDialogModel && oDialogModel.getProperty("/phase2")) ? oDialogModel.getProperty("/phase2/vValueGT") : ""
						};

						oJsonModelDialogData["phase3"] = {
							vValueLT: (oDialogModel && oDialogModel.getProperty("/phase3")) ? oDialogModel.getProperty("/phase3/vValueLT") : "",
							vValueGT: (oDialogModel && oDialogModel.getProperty("/phase3")) ? oDialogModel.getProperty("/phase3/vValueGT") : ""
						};

						oJsonModelDialogData["phase4"] = {
							vValueLT: (oDialogModel && oDialogModel.getProperty("/phase4")) ? oDialogModel.getProperty("/phase4/vValueLT") : "",
							vValueGT: (oDialogModel && oDialogModel.getProperty("/phase4")) ? oDialogModel.getProperty("/phase4/vValueGT") : ""
						};

						oJsonModelDialogData["phase5"] = {
							vValueLT: (oDialogModel && oDialogModel.getProperty("/phase5")) ? oDialogModel.getProperty("/phase5/vValueLT") : "",
							vValueGT: (oDialogModel && oDialogModel.getProperty("/phase5")) ? oDialogModel.getProperty("/phase5/vValueGT") : ""
						};

						if (!oDialogModel) {
							oDialogModel = new sap.ui.model.json.JSONModel();
							oDialog.setModel(oDialogModel);
						}
						oDialogModel.setData(oJsonModelDialogData);
						oDialog.open();
					}
				};
				var sPath;
				var sModelName = oReferenceCollection.getBindingInfo(aCollections[0].aggregation).model;
				// In KPI mode for charts, getBindingInfo would return the local JSONModel
				if (sModelName === "kpiModel") {
					sPath = oReferenceCollection.getObjectBinding().getPath();
				} else {
					sPath = oReferenceCollection.getBindingInfo(aCollections[0].aggregation).path;
				}
				mParams.filters = filters;
				oModel.read(sPath, mParams);
			}

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment({
					fragmentName: "com.sap.build.standard.inventoryDashboard.view.ViewSettingsDialog3"
				}, this);
				oDialog.attachEvent("confirm", confirmHandler);
				oDialog.attachEvent("resetFilters", resetFiltersHandler);

				this.mSettingsDialogs["ViewSettingsDialog3"] = oDialog;
			}

			var aCollections = [];

			aCollections.push({
				id: "sap_IconTabBar_Page_0-content-sap_chart_StackedColumnChart-1606414724064",
				aggregation: "data"
			});

			var oReferenceCollection = this.getView().byId(aCollections[0].id);
			var oSourceBindingContext = oReferenceCollection.getBindingContext();
			var oModel = oSourceBindingContext ? oSourceBindingContext.getModel() : this.getView().getModel();

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), oDialog);
			var designTimeFilters = this.mBindingOptions && this.mBindingOptions[aCollections[0].id] && this.mBindingOptions[aCollections[0].id]
				.filters && this.mBindingOptions[aCollections[0].id].filters[undefined];
			updateDialogData(designTimeFilters);

		},
		applyFiltersAndSorters: function (sControlId, sAggregationName, chartBindingInfo) {
			if (chartBindingInfo) {
				var oBindingInfo = chartBindingInfo;
			} else {
				var oBindingInfo = this.getView().byId(sControlId).getBindingInfo(sAggregationName);
			}
			var oBindingOptions = this.updateBindingOptions(sControlId);
			this.getView().byId(sControlId).bindAggregation(sAggregationName, {
				model: oBindingInfo.model,
				path: oBindingInfo.path,
				parameters: oBindingInfo.parameters,
				template: oBindingInfo.template,
				templateShareable: true,
				sorter: oBindingOptions.sorters,
				filters: oBindingOptions.filters
			});

		},
		createFiltersAndSorters: function () {
			this.mBindingOptions = {};
			var oBindingData, aPropertyFilters;
			oBindingData = {};
			oBindingData.sorters = [];

			oBindingData.sorters.push(new sap.ui.model.Sorter("date", false, false));
			this.updateBindingOptions("sap_IconTabBar_Page_0-content-sap_chart_StackedColumnChart-1606414724064", oBindingData);

		},
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Dashboard").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function () {
					if (sap.ui.Device.system.phone) {
						var oPage = oView.getContent()[0];
						if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
							oPage.setShowNavButton(true);
							oPage.attachNavButtonPress(function () {
								this.oRouter.navTo("1472700396089_S0", {}, true);
							}.bind(this));
						}
					}
				}.bind(this)
			});

			var oView = this.getView(),
				oData = {},
				self = this;
			var oModel = new sap.ui.model.json.JSONModel();
			oView.setModel(oModel, "staticDataModel");
			self.oBindingParameters = {};

			oData["sap_IconTabBar_Page_0-content-sap_chart_StackedColumnChart-1606414724064"] = {};

			oData["sap_IconTabBar_Page_0-content-sap_chart_StackedColumnChart-1606414724064"]["data"] = [{
				"dim0": "Week 1 - 4",
				"mea0": 24800.63,
				"mea1": 205199.37,
				"__id": 0
			}, {
				"dim0": "Week 5 - 8",
				"mea0": 99200.39,
				"mea1": 138799.61,
				"__id": 1
			}, {
				"dim0": "Week 9 - 12",
				"mea0": 70200.54,
				"mea1": 150799.46,
				"__id": 2
			}, {
				"dim0": "Week 13 - 16",
				"mea0": 158800.73,
				"mea1": 121199.27,
				"__id": 3
			}, {
				"dim0": "Week 17 - 20",
				"mea0": 140000.91,
				"mea1": 89999.09,
				"__id": 4
			}, {
				"dim0": "Week 21 - 24",
				"mea0": 172800.15,
				"mea1": 77199.85,
				"__id": 5
			}, {
				"dim0": "Week 25 - 28",
				"mea0": 237200.74,
				"mea1": 87799.26,
				"__id": 6
			}, {
				"dim0": "Week 29 - 32",
				"mea0": 243200.18,
				"mea1": 106799.82,
				"__id": 7
			}, {
				"dim0": "Week 33 - 37",
				"mea0": 280800.24,
				"mea1": 109199.76,
				"__id": 8
			}, {
				"dim0": "Week 38 - 42",
				"mea0": 320000.08,
				"mea1": 129999.92,
				"__id": 9
			}, {
				"dim0": "Week 43 - 47",
				"mea0": 360800.09,
				"mea1": 119199.91,
				"__id": 10
			}, {
				"dim0": "Week 47 - 52",
				"mea0": 403200.08,
				"mea1": 156799.92,
				"__id": 11
			}];

			self.oBindingParameters['sap_IconTabBar_Page_0-content-sap_chart_StackedColumnChart-1606414724064'] = {
				"path": "mesures",
				"parameters": {
					"entitySet": "MachinesSet"
				}
			};

			oData["sap_IconTabBar_Page_0-content-sap_chart_StackedColumnChart-1606414724064"]["vizProperties"] = {
				"plotArea": {
					"dataLabel": {
						"visible": true,
						"hideWhenOverlap": true
					}
				}, 
				"valueAxis": { 
					title:{ 
						visible: true, 
						text: 'Horas' } },
				"title": {
					text : 'Tiempo de producción (horas) por máquina',
					visible : true}
			};

			oView.getModel("staticDataModel").setData(oData, true);

			function dateDimensionFormatter(oDimensionValue, sTextValue) {
				var oValueToFormat = sTextValue !== undefined ? sTextValue : oDimensionValue;
				if (oValueToFormat instanceof Date) {
					var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
						style: "short"
					});
					return oFormat.format(oValueToFormat);
				}
				return oValueToFormat;
			}

			var aDimensions = oView.byId("sap_IconTabBar_Page_0-content-sap_chart_StackedColumnChart-1606414724064").getDimensions();
			aDimensions.forEach(function (oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			this.mAggregationBindingOptions = {};
			this.createFiltersAndSorters();

		},
		onAfterRendering: function () {

			var oChart,
				self = this,
				oBindingParameters = this.oBindingParameters,
				oView = this.getView();

			oView.getModel(undefined).getMetaModel().loaded().then(function () {
				oChart = oView.byId("sap_IconTabBar_Page_0-content-sap_chart_StackedColumnChart-1606414724064");
				var oParameters = oBindingParameters['sap_IconTabBar_Page_0-content-sap_chart_StackedColumnChart-1606414724064'];

				self.applyFiltersAndSorters("sap_IconTabBar_Page_0-content-sap_chart_StackedColumnChart-1606414724064", "data",
					oBindingParameters['sap_IconTabBar_Page_0-content-sap_chart_StackedColumnChart-1606414724064']);
					
			});
		}
	});
}, /* bExport= */ true);