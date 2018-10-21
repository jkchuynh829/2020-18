///<reference path='../types/tsd.d.ts' />
enum Color {
    DarkAquamarine = 0x45808E,
    LightAquamarine = 0x6299A4,
    DarkBlue = 0x004877,
    MediumBlue = 0x006DB0,
    LightBlue = 0x0093D2,
    DarkOrange = 0xFC8822,
    LightOrange = 0xFDA657,
    White = 0xFFFFFF,
    Gray = 0xbdbdbd,
    Black = 0x000000,
    Green = 0x5cb85c,
    LightGreen = 0x7ac07a,
    Red = 0xd9534f,
    LightRed = 0xd67875,
    OtherBlue = 0x00609D,
    LightOtherBlue = 0x0078c8
}

class PixiService {

	private static RENDERER_OPTION = 'FXAA';   //CANVAS, WEBGL, or FXAA
	private static NODE_WIDTH = 50;
	private static TEXT_SCALE_SMALL = new PIXI.Point(1.25, 1.25);
	private static TEXT_SCALE = new PIXI.Point(0.5, 0.5);
	private static TEXT_SCALE_BIG = new PIXI.Point(0.125, 0.125);
	private static style = new PIXI.TextStyle({
		align: 'center',
		fill: '#FFFFFF',
		fontFamily: 'Arial',
		fontSize: 24,
		padding: 3,
		wordWrap: true,
		wordWrapWidth: Math.ceil(((PixiService.NODE_WIDTH * 2) - (PixiService.NODE_WIDTH * 0.1)) * 2),
		breakWords: true
	});
	private static styleSmall = new PIXI.TextStyle({
		align: 'center',
		fill: '#FFFFFF',
		fontFamily: 'Arial',
		fontSize: 10,
		padding: 3,
		wordWrap: true,
		wordWrapWidth: Math.ceil(((PixiService.NODE_WIDTH * 2) - (PixiService.NODE_WIDTH * 0.1)) * 0.83),
		breakWords: true
	});		
	private static styleBig = new PIXI.TextStyle({
		align: 'center',
		fill: '#FFFFFF',
		fontFamily: 'Arial',
		fontSize: 96,
		padding: 3,
		wordWrap: true,
		wordWrapWidth: Math.ceil(((PixiService.NODE_WIDTH * 2) - (PixiService.NODE_WIDTH * 0.1)) * 8),
		breakWords: true
	});
	private static styleLinkMeasure = new PIXI.TextStyle({
		align: 'center',
		fill: '#FFFFFF',
		fontFamily: 'Arial',
		fontSize: 24,
		padding: 3,
	});
	private static centerAnchor = new PIXI.ObservablePoint(null,null,0.5, 0.5);

	static $inject = [
		'$document',
		'$rootScope',
		'commonNavigationState'
	]
	
	public newForeignKey : boolean;
	public stable : boolean;
	public remainingFramesAfterStable : number;
	public foreignKeys : string[];
	public addRemoveFunctions : any;
		
	constructor(
		private $document : ng.IDocumentService,
		private $rootScope : IRootScope,
		private commonNavigationState : any,
		private sidebarOpen : boolean,
		private height : number,
		private width : number,
		private renderer : any,
		private support : string,
		private prefix : string = '',
		private _addEventListener : string,
		private redraw : boolean,
		private showMembers : boolean,
		private autoShowHideMembers : boolean,
		private currentBounds : any,
		private isTracking : boolean,
		private curMousePos : {x : any, y : any},
        private selected : {
            selectedNode : {name : string, url? : string, sql? : string, sqlParameterType? : string, members : any[], records : any[], referenced : any[], sqlNestedLinks : any[], node? : any, circle : any},
            selectedMember: {name : string, rectangle : any}
        },
        private selectionCallbacks : ((selectedNode : any, selectedMember : any) => any) [],
        private recordsMap : any [],
        private membersMap : any [],
        private linksMap : any [],
        private failedMembers : any [],
        private failedNodes : any [],
		private getGraphCoordinates : any,
		private graphPos : any,
		private addMetadataSidebar : boolean,
		private draggingNode : boolean,
		private formulaRefs : any [],
		private animationStepRatios : any [],
		private nodeUnderCursor : any
	) {
		this.graphPos = {x: 0, y: 0};
		this.sidebarOpen = commonNavigationState.getNavPanelState().opened;
		this.height = window.innerHeight - (this.sidebarOpen ? 180 : 120);
        this.width = window.innerWidth - (this.sidebarOpen ? 300 : 43);
        this.showMembers = true;
        this.autoShowHideMembers = true;
        this.selectionCallbacks = [];
        this.recordsMap = [];
        this.membersMap = [];
        this.linksMap = [];
        this.foreignKeys = [];
		this.formulaRefs = [];
		this.failedMembers = [];
		this.failedNodes = [];
		this.isTracking = false;
		this.nodeUnderCursor = null;
		this.animationStepRatios = [0.002, 0.003, 0.004, 0.005, 0.006, 0.007, 0.008, 0.009, 0.010, 0.011, 
			0.012, 0.013, 0.0140, 0.015, 0.016, 0.017, 0.018, 0.019, 0.020, 0.021, 
			0.022, 0.023, 0.024, 0.025, 0.026, 0.027, 0.028, 0.028, 0.028, 0.028, 
			0.028, 0.028, 0.028, 0.027, 0.026, 0.025, 0.024, 0.023, 0.022, 0.021, 
			0.020, 0.019, 0.018, 0.017, 0.016, 0.015, 0.014, 0.013, 0.012, 0.011, 
			0.010, 0.009, 0.008, 0.007, 0.006, 0.005, 0.004, 0.003, 0.002, 0.001];
		this.animationStepRatios.forEach((ele,ind,arr) => { arr[ind] = arr[ind-1] ? arr[ind-1] + ele : ele})
		// detect available wheel event
		this.support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
			document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
			"DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

    	// detect event model
    	if ( window.addEventListener ) {
    	    this._addEventListener = "addEventListener";
    	} else {
    	    this._addEventListener = "attachEvent";
    	    this.prefix = 'on';
    	}
	}
	
	dispose() {
		this.sidebarOpen = this.commonNavigationState.getNavPanelState().opened;
		this.height = window.innerHeight - (this.sidebarOpen ? 180 : 120);
        this.width = window.innerWidth - (this.sidebarOpen ? 300 : 43);
        this.isTracking = false;
        this.selectionCallbacks = [];
        this.recordsMap = [];
        this.membersMap = [];
        this.linksMap = [];
        this.foreignKeys = [];
        this.formulaRefs = [];
        this.failedMembers = [];
        this.failedNodes = [];
        this.selected = null;
        if (this.autoShowHideMembers) {
        	this.$rootScope.showMembers = true;
        	this.showMembers = true;
        }
	}

	toggleMembers(auto) {
		if(!auto) {
			this.autoShowHideMembers = false;
		}
		this.showMembers = !this.showMembers;
		this.redraw = true;
	}
	
	getAddRemoveFunctions(functions) {
		this.addRemoveFunctions = functions;
	}

	createPixiGraphics(graph, layout) {
		var stage = new PIXI.Container();
		stage.interactive = true;
		if (PIXI.utils.isWebGLSupported()) {
			if (PixiService.RENDERER_OPTION === 'FXAA') {
				this.renderer = new PIXI.WebGLRenderer(this.width, this.height, {transparent: false, antialias: true, forceFXAA: true });
			} else if (PixiService.RENDERER_OPTION === 'WEBGL') {
				this.renderer = new PIXI.WebGLRenderer(this.width, this.height, {transparent: false, antialias: false, forceFXAA: false });
			} else {
				this.renderer = new PIXI.CanvasRenderer({ width: this.width, height: this.height, transparent: true, antialias: false });
			}
		} else {
			this.renderer = new PIXI.CanvasRenderer({ width: this.width, height: this.height, transparent: true, antialias: false });
		}
		this.renderer.backgroundColor = Color.White;
		this.renderer.view.style.display = "block";
		var graphEl = document.getElementById("graph");
		graphEl.style.cursor = 'default';
		graphEl.style.overflow = 'hidden';
		graphEl.appendChild(this.renderer.view);

		var canvas = new PIXI.Graphics();
		canvas.position.x = this.width / 2;
		canvas.position.y = this.height / 2;															
		canvas.scale.x = 1;
		canvas.scale.y = 1;
		var tHeight = 20 * (Math.sqrt(3) / 2);
		// animation loop:
		var linkLabelLayer = new PIXI.Graphics(),
			nodeTooltipLayer = new PIXI.Graphics(),
			nodeLayer = new PIXI.Graphics(),
			linkArrowLayer = new PIXI.Graphics(),
			dataSetLinkArrowLayer = new PIXI.Graphics(),
			linkTooltipLayer = new PIXI.Graphics(),
			foreignKeyArrowLayer = new PIXI.Graphics();
		canvas.addChild(foreignKeyArrowLayer);
		canvas.addChild(linkArrowLayer);
		canvas.addChild(dataSetLinkArrowLayer);
		canvas.addChild(linkLabelLayer);
		canvas.addChild(nodeLayer);
		canvas.addChild(nodeTooltipLayer);
		canvas.addChild(linkTooltipLayer);
        
		var nodePositions = [],
			getNodeByIndex = [],
			linkPositions = [],
			animateNode : any = {},
			animateNodeZoom = [],
			dataSetLinkPositions = [],
			memberLinkPositions = [];
		var text;
		var addForeignKeyArrow = (fKeyName) => {
			var triangle = new PIXI.Graphics();
			triangle.beginFill(Color.Gray);
			triangle.position.x = 0;
			triangle.position.y = 0;
			triangle.scale.x = 1;
			triangle.scale.y = 1;
			triangle.moveTo(10, 0);
			triangle.lineTo(0, tHeight);
			triangle.lineTo(20, tHeight);
			triangle.moveTo(20, tHeight);
			triangle.lineTo(0, tHeight);
			triangle.endFill();
			triangle.pivot = new PIXI.Point(10, 0);
			triangle.name = fKeyName;
			foreignKeyArrowLayer.addChild(triangle);
		}
		this.foreignKeys.forEach((key) => addForeignKeyArrow(key));
		
		var buildLink = (link) => {
			if (link.data.NodeType === NodeType.MEMBER_LINK) {
				memberLinkPositions.push(_.extend(layout.getLinkPosition(link.id), {name: link.id}));
				return;
			}
			var linkPosition = _.extend({fromId: link.fromId, toId: link.toId, id: link.id}, layout.getLinkPosition(link.id));
			var triangle = new PIXI.Graphics();
			triangle.beginFill(Color.Gray);
			triangle.position.x = 0;
			triangle.position.y = 0;
			triangle.scale.x = 1;
			triangle.scale.y = 1;
			triangle.moveTo(10, 0);
			triangle.lineTo(0, tHeight);
			triangle.lineTo(20, tHeight);
			triangle.moveTo(20, tHeight);
			triangle.lineTo(0, tHeight);
			triangle.endFill();
			triangle.pivot = new PIXI.Point(10, 0);
			triangle.name = link.id;
			if (link.data.NodeType === NodeType.LINK) {
				dataSetLinkPositions.push(linkPosition);
				dataSetLinkArrowLayer.addChild(triangle);
			} else {
				linkPositions.push(linkPosition);
				linkArrowLayer.addChild(triangle);
				var linkBox = new PIXI.Graphics();
				linkBox.name = link.data.type.fieldName + '+' + link.fromId;
				linkBox.NodeType = link.data.NodeType;
				linkBox.sqlParameterType = link.data.sqlParameterType;
				linkBox.violations = [];
                this.paintLinkBox(linkBox);
				this.linksMap[link.fromId + '+' + link.data.type.fieldName] = linkBox;
                linkBox.on('click', (isSearch) => {
                	isSearch = isSearch === 'search' ? true : false;
                	if (!this.$rootScope.isMetadataValid) return;
                    if (this.draggingNode)  return;
                    if (this.recordsMap[link.fromId] && (!this.selected || this.selected.selectedNode.name != link.fromId)) {
                        this.recordsMap[link.fromId].emit('click');
                    }
                    if (this.selected && this.selected.selectedMember && this.selected.selectedMember.name != link.data.type.fieldName) {
                    	var selectedMember = this.selected.selectedMember;
                    	this.selected.selectedMember = {name: link.data.type.fieldName, rectangle: linkBox};
                        if (selectedMember.rectangle.NodeType === NodeType.LINK_BOX) {
                            this.paintLinkBox(selectedMember.rectangle);
                        } else {
                            this.paintRectangle(selectedMember.rectangle);
                        }
                    }
                    this.selected.selectedMember = {name: link.data.type.fieldName, rectangle: linkBox};
                    this.formulaRefs.forEach(member => {member.isFormulaRef = false; return this.membersMap[member.name] ? this.paintRectangle(member) : this.paintLinkBox(member)});
            		this.formulaRefs.length = 0;
                    this.paintLinkBox(linkBox);
                    this.selectionCallbacks.forEach(callback => {
                        callback(_.pick(this.selected.selectedNode, 'name', 'url', 'sql', 'sqlParameterType', 'members', 'records', 'referenced', 'sqlNestedLinks', 'node', 'circle'), _.pick(this.selected.selectedMember, 'name', 'rectangle'));
                    })
                    if (isSearch) {
	                	this.goToNode(linkBox, canvas, animateNode, animateNodeZoom, isSearch);
                    }
                });
				var textString = link.data._templateSQL ? link.data._templateSQL : link.data.type.fieldName;
				linkBox.textString = (textString === RESULTSET_INTERNAL_NAME ? 'Result Set' : textString);
				var displayText = this.analyzeLinkText(linkBox.textString);
				text = new PIXI.Text(displayText, PixiService.style);
				text.anchor = PixiService.centerAnchor;
				text.position.set(PixiService.NODE_WIDTH * 0.75, PixiService.NODE_WIDTH/4);
				text.cacheAsBitmap = true;
				linkBox.addChild(text)
				
				text = new PIXI.Text(displayText, PixiService.styleBig);
				text.anchor = PixiService.centerAnchor;
				text.position.set(PixiService.NODE_WIDTH * 0.75, PixiService.NODE_WIDTH/4);
				text.cacheAsBitmap = true;
				linkBox.addChild(text);
				
				text = new PIXI.Text(displayText, PixiService.styleSmall);
				text.anchor = PixiService.centerAnchor;
				text.position.set(PixiService.NODE_WIDTH * 0.75, PixiService.NODE_WIDTH/4);
				text.cacheAsBitmap = true;
				linkBox.addChild(text);
				
				linkLabelLayer.addChild(linkBox);
				var flag = false,
					tooltip = new PIXI.Graphics(),
					mousedown = false,
					timeoutId = null,
					show = (eventData) => {
						if (animateNode.isPanning && !this.isTracking) return;
                        if (!this.selected || !this.selected.selectedMember || this.selected.selectedMember.rectangle !== linkBox) {
                        	linkBox.isHovered = true;
                        	if (_.find(this.formulaRefs, (obj) => obj === linkBox)) {
                        		linkBox.isFormulaRef = true;
                        	}
                        	this.paintLinkBox(linkBox);
							graphEl.style.cursor = 'pointer';
						}
						if (mousedown) {
							return;
						}
						flag = true;
						timeoutId = setTimeout(() => {
							if (flag) {
								this.showTooltip(tooltip, canvas, linkBox, false);
								this.redraw = true;
								this.renderer.render(canvas);
							}
						}, 1000);
					},
					hide = (eventData) => {
                        graphEl.style.cursor = 'default';
						if (!this.selected || !this.selected.selectedMember || this.selected.selectedMember.rectangle !== linkBox) {
							linkBox.isHovered = false;
							if (_.find(this.formulaRefs, (obj) => obj === linkBox)) {
                        		this.paintLinkBox(linkBox);
                        	} else {
                        		this.paintLinkBox(linkBox);
                        	}
						}
						clearTimeout(timeoutId);
						flag = false;
						timeoutId = null;
						this.hideTooltip(tooltip);
						this.redraw = true;
						this.renderer.render(canvas);
					};
				linkBox.on('mouseover', show);
				linkBox.on('mouseout', hide);
				linkBox.on('mousedown', () => {
					mousedown = true;
					hide(null);
				})
				linkBox.on('mouseup', () => {
					mousedown = false;
					//show(null); clicking link that becomes hidden under metadata panel will never hide tooltip
				});
				linkBox.interactive = true;
				tooltip.name = link.id;
				linkTooltipLayer.addChild(tooltip);
			}
		}
		var removeLink = (link) => {
			if (link.data.NodeType !== NodeType.LINK_BOX && link.data.NodeType !== NodeType.LINK) {
				var index = _.findIndex(memberLinkPositions, linkPosition => linkPosition.name === link.id);
				if (index !== -1) {
					memberLinkPositions.splice(index,1);
				}
			} else {
				delete this.linksMap[link.fromId + "+" + link.data.type.fieldName];
				var index = _.findIndex(linkArrowLayer.children, child => child.name && child.name === link.id);
				if (index !== -1) {
					linkArrowLayer.children[index].destroy(true);
					linkTooltipLayer.children[index].destroy(true);
					linkLabelLayer.children[index].destroy(true);
					index = -1;
				} else {
					index = _.findIndex(dataSetLinkArrowLayer.children, child => child.name && child.name === link.id);
					if (index !== -1) {
						dataSetLinkArrowLayer.children[index].destroy(true);
					}
				}
				index = _.findIndex(linkPositions, linkPosition => linkPosition.id === link.id);
				if (index !== -1) {
					linkPositions.splice(index,1);
				} else {
					index = _.findIndex(dataSetLinkPositions, linkPosition => linkPosition.id === link.id);
					if (index !== -1) {
						dataSetLinkPositions.splice(index,1);
					}
				}
			}
			var r;
			if (this.selected) {
				r = this.recordsMap[this.selected.selectedNode.name];
				this.selected.selectedMember = null;
			}
            if (r) {
                r.emit('click');
            }
            
		}
		graph.forEachLink((link) => buildLink(link));
		var buildNode = (node, select = false) => {
			nodePositions.push([layout.getNodePosition(node.id), node.data, node.id]);
			getNodeByIndex[nodePositions.length - 1] = node;
			var isMemberTypes = <any>[NodeType.MEMBER, NodeType.LIST, NodeType.KEY, NodeType.DELAY, NodeType.SQL_PARAMETER];
			var container = null,
				isMember = node.data && isMemberTypes.includes(node.data.NodeType);
			if (isMember) {
				var rectangle = new PIXI.Graphics();
	            rectangle.interactive = true;
	            rectangle.name = node.id;
	            rectangle.NodeType = node.data.NodeType;
	            rectangle.sqlParameterType = node.data.sqlParameterType;
	            rectangle.violations = [];
				this.paintRectangle(rectangle);
	            this.membersMap[node.id] = rectangle;    
	            rectangle.on('mousedown',() => {
	            	this.nodeUnderCursor = node;
	            });
	            rectangle.on('click', (isSearch) => {
                	isSearch = isSearch === 'search' ? true : false;
	            	if (!this.$rootScope.isMetadataValid) return;
	                if (this.draggingNode) return;
	                var ids = node.id.split('+');
	                if (ids.length < 2) {
	                    return;
	                }
	                if (this.recordsMap[ids[1]] && (!this.selected || this.selected.selectedNode.name != ids[1])) {
	                    this.recordsMap[ids[1]].emit('click');
	                }
	                if (this.selected && this.selected.selectedMember && this.selected.selectedMember.name != ids[0]) {
	                	var selectedMember = this.selected.selectedMember;
	                	this.selected.selectedMember = {name: ids[0], rectangle: rectangle};
	                    if (selectedMember.rectangle.NodeType === NodeType.LINK_BOX) {
	                        this.paintLinkBox(selectedMember.rectangle); // Color.DarkBlue
	                    } else {
	                        this.paintRectangle(selectedMember.rectangle);
	                    }
	                }
	                this.selected.selectedMember = {name: ids[0], rectangle: rectangle};
	                this.formulaRefs.forEach(member => {member.isFormulaRef = false; return this.membersMap[member.name] ? this.paintRectangle(member) : this.paintLinkBox(member)});
            		this.formulaRefs.length = 0;
	            	(this.$rootScope.allFormulaReferences[ids[1] + '+' + ids[0]] || {references: []}).references.forEach(memberName => {
	            		var rect = this.linksMap[memberName] || this.membersMap[memberName.split('+').reverse().join('+')];
	            		this.formulaRefs.push(rect);
	            		rect.isFormulaRef = true;
	            		if (this.linksMap[memberName]) {
	            			this.paintLinkBox(rect);
	            		} else {
	            			this.paintRectangle(rect);
	            		}
	            	});
	                this.paintRectangle(rectangle);
	                this.selectionCallbacks.forEach(callback => {
	                    callback(this.selected.selectedNode, this.selected.selectedMember);
	                })
	                var centerNode = layout.getNodePosition(node.id);
	                if (isSearch && centerNode) {
	                	this.goToNode(centerNode, canvas, animateNode, animateNodeZoom, isSearch);
	                }
	            });
				container = rectangle;
			} else {
				var circle = new PIXI.Graphics();
	            circle.interactive = true;
	            circle.name = node.id;
	            circle.displayName = node.data.displayName || null;
	            circle.NodeType = node.data.NodeType;
	            circle.violations = [];
	            circle.sqlParameterType = node.data.sqlParameterType;
	            circle.sql = node.data.NodeType !== NodeType.RESULT_SET ? node.data.sql : null;
	            this.paintNode(circle);
	            this.recordsMap[node.id] = circle;
	            circle.on('update', (memberName, props) => {
	            	var mem : any = _.find(node.data.members, (ele : any) => ele.name === memberName);
	            	if (mem) {
	            		delete mem.type['constraint:foreignKey'];
	            	}
	            });	
	            circle.on('mousedown',() => {
	            	this.nodeUnderCursor = node;
	            });
	            circle.on('click', (isSearch) => {
                	isSearch = isSearch === 'search' ? true : false;
	            	if (!this.$rootScope.isMetadataValid) return;
	            	if (this.draggingNode) return;
	            	this.isTracking = false;
	            	var referenced = [], records = [], sqlNestedLinks = [];
		            node.links.forEach(link => {
		                if (link.data && node.id === link.toId && !_.find(referenced, {name: link.fromId})) {
                            referenced.push({NodeType: link.data.NodeType, name: link.fromId, type: link.data.type});
		                }
		                if (link.data.NodeType !== NodeType.MEMBER_LINK && node.id === link.fromId) {
		                	if (link.data.sqlNestedLink) {
                                sqlNestedLinks.push({NodeType: link.data.NodeType, name: link.data.type.fieldName, type: link.data.type, link: link, sqlNestedLink: true, sqlParameterType: link.data.sqlParameterType});
		                	} else {
                                records.push({NodeType: link.data.NodeType, name: link.data.type.fieldName, type: link.data.type, link: link});
		                	}
		                }
		            });
	                if (this.selected) {
	                	var selected = this.selected;
	                	this.selected = {selectedNode : {name: node.id, url: node.data.url, sql: node.data.sql, sqlParameterType: node.data.sqlParameterType, members: node.data.members, records: records, referenced: referenced, sqlNestedLinks: sqlNestedLinks, node: node, circle: circle}, selectedMember : undefined};
	                    if (selected.selectedNode.name != node.id) {
	                        this.paintNode(selected.selectedNode.circle);
	                    }
	                    if (selected.selectedMember) {
	                        if (selected.selectedMember.rectangle.NodeType === NodeType.LINK_BOX) {
	                            this.paintLinkBox(selected.selectedMember.rectangle);
	                        } else {
	                            this.paintRectangle(selected.selectedMember.rectangle);
	                        }
	                    }
	                }
                	this.selected = {selectedNode : {name: node.id, url: node.data.url, sql: node.data.sql, sqlParameterType: node.data.sqlParameterType, members: node.data.members, records: records, referenced: referenced, sqlNestedLinks: sqlNestedLinks, node: node, circle: circle}, selectedMember : undefined};
	                this.paintNode(circle);
	                this.formulaRefs.forEach(member => {member.isFormulaRef = false; return this.membersMap[member.name] ? this.paintRectangle(member) :  this.paintLinkBox(member)});
            		this.formulaRefs.length = 0;
	                this.selectionCallbacks.forEach(callback => {
	                    callback(this.selected.selectedNode, undefined)
	                })
	                var centerNode = layout.getNodePosition(node.id);
	                if (isSearch) {
	                	this.goToNode(centerNode, canvas, animateNode, animateNodeZoom, isSearch);
	                } else if (centerNode && (this.addMetadataSidebar &&  centerNode.x >= this.currentBounds[1].x - 300 * (1/canvas.scale.x)) ||  (centerNode.x <= this.currentBounds[0].x || centerNode.x >= this.currentBounds[1].x || centerNode.y <= this.currentBounds[0].y || centerNode.y >= this.currentBounds[1].y )) {
	                	this.goToNode(centerNode, canvas, animateNode, animateNodeZoom, isSearch);
	                }
	                this.addMetadataSidebar = false;
	            });
				container = circle;
			}
			
			this.buildNodeText(container, node);
			
			if (isMember && node.data.type && _.has(node.data.type, 'generate')) {
				this.addGearIcon(container);
			}
			nodeLayer.addChild(container);
			var flag = false,
				tooltip = new PIXI.Graphics(),
				mousedown = false,
				timeoutId = null,
				show = (eventData) => {
					if (animateNode.isPanning && !this.isTracking) return;
					container.isHovered = true;
					if (!isMember) {
						if (!this.selected || this.selected.selectedNode.circle !== container) {
							this.paintNode(container);
							graphEl.style.cursor = 'pointer';
						}
					} else {
						if (!this.selected || !this.selected.selectedMember || this.selected.selectedMember.rectangle !== container) {
							this.paintRectangle(container);
							graphEl.style.cursor = 'pointer';
						}
					}
					if (mousedown) {
						return;
					}
					flag = true;
					timeoutId = setTimeout(() => {
						if (flag) {
							this.showTooltip(tooltip, canvas, circle || rectangle, true);
							this.redraw = true;
							this.renderer.render(canvas);
						}
					}, 1000);
				},
				hide = (eventData) => {
					graphEl.style.cursor = 'default';
					container.isHovered = false;
					if (!isMember) {
						this.paintNode(container);
					} else {
						this.paintRectangle(container);
					}
					clearTimeout(timeoutId);
					flag = false;
					timeoutId = null;
					this.hideTooltip(tooltip);
					this.redraw = true;
					this.renderer.render(canvas);
				};
			container.mouseover = show;
			container.mouseout = hide;
			container.mousedown = () => {
				mousedown = true;
				hide(null);
			}
			container.mouseup = () => {
				mousedown = false;
				//show(null); clicking member that becomes hidden under metadata panel will never hide tooltip
			}
			container.interactive = true;
			tooltip.name = node.id;
			nodeTooltipLayer.addChild(tooltip);
			if (select) container.emit('click');
		}
		var removeNode = (node, isRecord) => {
			var index = _.findIndex(nodeLayer.children, child => child.name && child.name === node.id);
			if (index !== -1) {
				nodeLayer.children[index].destroy(true);
				nodeTooltipLayer.children[index].destroy(true);
			}
			index = _.findIndex(nodePositions, element => element[2] === node.id);
			if (index !== -1) {
				nodePositions.splice(index,1);
				getNodeByIndex.splice(index,1);
			}
			delete this.membersMap[node.id];
			delete this.recordsMap[node.id];
			if (isRecord) {
				this.selected = null;
			}
		}
		graph.forEachNode((node) => buildNode(node));
		stage.addChild(canvas);
		this.stable = false;
		this.remainingFramesAfterStable = 0;
		this.selected = null;
		
		var removeForeignKeyArrow = (arrowName) => {
			var index = _.findIndex(foreignKeyArrowLayer.children, child => child.name === arrowName);
			if (index !== -1) {
				foreignKeyArrowLayer.children[index].destroy(true);
			}
		}
		
		return {
			renderFrame: () => {
				if (!this.stable || this.remainingFramesAfterStable) {
					this.stable = layout.step();
					if (this.stable && this.remainingFramesAfterStable) {
						this.remainingFramesAfterStable--;
					} else {
						this.newForeignKey = false;
					}
					this.redraw = true;
				}
				if (this.redraw) {
					this.drawGraph(canvas, nodePositions, linkPositions, dataSetLinkPositions, memberLinkPositions, animateNode, animateNodeZoom);
					this.renderer.render(stage);
					this.redraw = false;
				}
			},
			renderer: this.renderer,
			domContainer: this.renderer.view,
			graphGraphics: canvas,
			stage: stage,
			buildNode: buildNode,
			buildLink: buildLink,
			removeLink: removeLink,
			removeNode: removeNode,
			addForeignKeyArrow: addForeignKeyArrow,
			removeForeignKeyArrow: removeForeignKeyArrow,

			dispose: () => {
				stage.destroy({ children: true, texture: true, baseTexture: true });
				this.renderer.destroy(true);
			}
		};
	}

    registerSelectionCallback (callback : (node : any)  => any) {
        this.selectionCallbacks.push(callback);
    }

    deselectNode () {
        if (this.selected) {
        	var selected = this.selected;
        	this.selected = null;
            this.paintNode(selected.selectedNode.circle);
            if (selected.selectedMember) {
                if (selected.selectedMember.rectangle.NodeType === NodeType.LINK_BOX) {
                    this.paintLinkBox(selected.selectedMember.rectangle);
                } else {
                    this.paintRectangle(selected.selectedMember.rectangle);
                }
                this.formulaRefs.forEach(member => {member.isFormulaRef = false; return this.membersMap[member.name] ? this.paintRectangle(member) :  this.paintLinkBox(member)});
        		this.formulaRefs.length = 0;
            }
        }
    }

    selectRecordType (recordTypeName : string) {
        var recordType = this.recordsMap[recordTypeName];
        if (recordType) {
            recordType.emit('click');
        }
    }

    updateMemberProperties(recordName : string, memberName : string) {
        var recordType = this.recordsMap[recordName];
        if (recordType) {
            recordType.emit('update', memberName);
        }
    }
    
    selectMember (memberName : string, isRecord : boolean) {
        if (isRecord) {
            var member = this.linksMap[this.selected.selectedNode.name + '+' + memberName];
            if (member) {
                member.emit('click');
            }
        } else {
            var member = this.membersMap[memberName + '+' + this.selected.selectedNode.name];
            if (member) {
                member.emit('click');
            }
        }
    }

    mouseOver(memberName : string, isHovered : boolean, isList? : boolean) {
        if (isList === undefined) {
            var link = this.linksMap[this.selected.selectedNode.name + '+' + memberName];
            link.isHovered = isHovered;
            this.paintLinkBox(link);
        } else {
            var member = this.membersMap[memberName + '+' + this.selected.selectedNode.name];
            member.isHovered = isHovered;
            this.paintRectangle(member);
        }
    }
    private inferClass(ele) {
    	switch(ele.NodeType) {
    		case NodeType.RECORD:
    			return 'search-icon fa-circle lvl-1';
	    	case NodeType.RESULT_SET:
//	    	case NodeType.METADATA:
    			return 'search-icon fa-circle lvl-3';
    		case NodeType.SQL_TEMPLATE:
    			return 'search-icon fa-dot-circle-o lvl-2';
	    	case NodeType.DATASET:
	    		return 'search-icon fa-dot-circle-o lvl-1';
	    	case NodeType.SQL_DATASET:
	    		return 'search-icon fa-database lvl-1';
	    	case NodeType.MEMBER:
//	    	case NodeType.DELAY:
	    		return 'search-member-icon icon-primitive-member' + (ele.name.includes(':ResultSet') ? ' lvl-4' : ' lvl-2');
	    	case NodeType.LIST:
	    		return 'search-member-icon icon-list-member lvl-2';
	    	case NodeType.KEY:
	    		return 'search-member-icon fa-key lvl-2';
	    	case NodeType.SQL_PARAMETER:
	    		return 'search-member-icon fa-key lvl-3';
	    	default:
	    		return 'search-member-icon icon-primitive-member link-box' + (ele.name.split('+')[1].includes(':ResultSet') ? ' lvl-4' : ' lvl-2');
    	}
    }
    
    getRecordsList() {
    	var nestedMap = {};
    	var caching = null;
    	var collator = new Intl.Collator('en', { numeric: true});
    	return _.keys(this.recordsMap).map((ele : any):any => {
    		return {
    			'displayName': <string> this.recordsMap[ele].sql ? (this.recordsMap[ele].displayName || ele.split(':')[1].toUpperCase()) + ": " + this.recordsMap[ele].sql : this.recordsMap[ele].NodeType === NodeType.RESULT_SET ? (this.recordsMap[ele].displayName || "Result Set") : ele,
				'displayProperty' : <string> this.recordsMap[ele].sql ? (this.recordsMap[ele].displayName || 'SQL') : this.recordsMap[ele].NodeType === NodeType.RESULT_SET ? (this.recordsMap[ele].displayName || "Result Set") : ele,
				'name': <string> ele.replace(':Result', ':sql' + ele.substring(ele.lastIndexOf(':ResultSet') + 10) + '#Result'), //.replace(':Metadata', ':sql' + ele.substring(ele.lastIndexOf(':Metadata') + 9) + '#zMetadata')
    			'class': <string> this.inferClass(this.recordsMap[ele]),
    			'violations': this.recordsMap[ele].violations,
				'sqlType': this.recordsMap[ele].sqlParameterType,
				'NodeType' : this.recordsMap[ele].NodeType,
    			}
    		})
    		.concat(_.keys(this.linksMap)
    				.filter((ele : any) => {
    					return !this.linksMap[ele].name.endsWith(':sql');
    				})
    				.map((ele : any) => {
    					if (this.linksMap[ele].sqlParameterType) nestedMap[this.linksMap[ele].sqlParameterType] = {sqlDataSet: ele.split(':')[0], sqlIndex: ele.substring(ele.lastIndexOf(':ResultSet') + 10, ele.lastIndexOf('+'))};
    					return {
							'displayName': <string>  ele.endsWith(RESULTSET_INTERNAL_NAME) ? "Result Set" : ele.split('+')[1],
							'displayProperty': <string>  ele.endsWith(RESULTSET_INTERNAL_NAME) ? "Result Set" : ele.split('+')[1],
    						'name': <string>  ele.split('+').map(ele => ele.replace(':Result', ':sql' + ele.substring(ele.lastIndexOf(':ResultSet') + 10) + '#Result')).join('.').replace(RESULTSET_INTERNAL_NAME, 'resultset_'),
    						'class': <string> this.inferClass(this.linksMap[ele]),
    						'violations': this.linksMap[ele].violations,
							'sqlType':  ele.endsWith(RESULTSET_INTERNAL_NAME) ? 0 : null,
							'NodeType': this.linksMap[ele].NodeType
    					}
    			}))
    		.concat(_.keys(this.membersMap).map((ele : any) => {
    			return {
					'displayName': <string> ele.split('+')[0],
					'displayProperty': <string> ele.split('+')[0],
    				'name': <string> ele.replace(':Result', ':sql' + ele.substring(ele.lastIndexOf(':ResultSet') + 10) + '#Result').split('+').reverse().join('.'), // .replace(DELAY_MEMBER_INTERNAL_NAME,'Delay (ms)').replace(':Metadata', ':sql' + ele.substring(ele.lastIndexOf(':Metadata') + 9) + '#zMetadata')
    				'class': <string> this.inferClass(this.membersMap[ele]),
    				'violations': this.membersMap[ele].violations,
					'sqlType': this.membersMap[ele].sqlParameterType,
					'NodeType': this.membersMap[ele].NodeType
    				}
    			}))
    		.sort((a,b) => collator.compare(a.name.toLowerCase(),b.name.toLowerCase()))
    		.map(ele => {
    			ele.name = ele.name.replace(/:sql([0-9]+)#[z]?/, ':').replace('resultset_', RESULTSET_INTERNAL_NAME);
    			return ele;
    		})
    		.filter(ele => {
    			if (ele.sqlType && nestedMap[ele.sqlType]) {
    				caching = nestedMap[ele.sqlType];
    				caching['currentIndex'] = parseInt(ele.name.substring(ele.name.lastIndexOf(':ResultSet') + 10));
    				caching['cache'] = [ele];
    				return false;
    			}
    			if (caching) {
    				if (caching.currentIndex === parseInt(ele.name.substring(ele.name.lastIndexOf(':ResultSet') + 10))) {  // || caching.currentIndex === parseInt(ele.displayName.substring(ele.displayName.lastIndexOf(':Metadata') + 9))
    					caching.cache.push(ele);
    					return false;
    				} else {
    					caching = null;
    					return true;
    				}	
    			}
    			return true;
    		})
    		.reduce((acc,ele,ind,arr) => {
    			var inject = null;
    			_.keys(nestedMap).forEach(key => {
    				if (ele.name.indexOf(nestedMap[key].sqlDataSet) === 0 && (ele.name.match(/:[a-zA-Z]+([0-9]+)/) || [null,null])[1] === nestedMap[key].sqlIndex) {
    					if (!arr[ind+1] || (arr[ind + 1].name.indexOf(nestedMap[key].sqlDataSet) !== 0 || (arr[ind + 1].name.match(/:[a-zA-Z]+([0-9]+)/) || [null,null])[1] !== nestedMap[key].sqlIndex)) {
    							inject = key;
    						}
    					}
    				});
    			acc.push(ele);
    			if (inject) {
    				acc.push(...nestedMap[inject].cache);
    				delete nestedMap[inject];   
    			}
    			return acc;
    		}, []);
    }
    
    goToSearchResult(recordName) {
    	var node = this.recordsMap[recordName] || this.membersMap[recordName.split('.').reverse().join('+')] || this.linksMap[recordName.replace('.','+')]; // .replace('Delay (ms)', DELAY_MEMBER_INTERNAL_NAME)  <--in membersMap
    	if (node) node.emit('click', 'search');
    	
    }
    
	private addGearIcon(node) {
		var normalIcon = new PIXI.Text('\uf013', {
			fill: '#ffffff',
			fontSize: '24px',
			fontFamily: 'fontawesome'
		});
		var largeIcon = new PIXI.Text('\uf013', {
			fill: '#ffffff',
			fontSize: '96px',
			fontFamily: 'fontawesome'
		});
		normalIcon.x = 44;
		normalIcon.y = 10;
        normalIcon.rotation = 0.42;
		largeIcon.x = 44;
		largeIcon.y = 10;
        largeIcon.rotation = 0.42;
		normalIcon.anchor = new PIXI.ObservablePoint(null, null, 0.5, 0.5);
		largeIcon.anchor = new PIXI.ObservablePoint(null, null, 0.5, 0.5);
		node.addChild(normalIcon);
		node.addChild(largeIcon);
	}

	showGearIcon(member : string, recordType : string) {
		var memberNode = this.membersMap[member + '+' + recordType];
		if (!memberNode) {
			return;
		}
		if (memberNode.children.length > 3) {
			return;
		}
		this.addGearIcon(memberNode);
		this.redraw = true;
	}

	hideGearIcon(member : string, recordType : string) {
		var memberNode = this.membersMap[member + '+' + recordType];
		if (!memberNode) {
			return;
		}
		if (memberNode.children.length <= 3) {
			return;
		}
		memberNode.removeChildAt(4);
		memberNode.removeChildAt(3);
		this.redraw = true;
	}

    private paintNode(circle) {
    	var color = this.inferColor(circle);
        circle.clear();
        if (circle.NodeType === NodeType.SQL_DATASET) {       	 
        	circle.lineStyle(1,color,1);
            circle.beginFill(color);
            circle.drawRect(-PixiService.NODE_WIDTH, 25, PixiService.NODE_WIDTH * 2, 16);
            circle.drawEllipse(0, 41, PixiService.NODE_WIDTH, PixiService.NODE_WIDTH/4);
            circle.endFill(color);
            circle.lineStyle(0);
            circle.beginFill(Color.White);               
            circle.drawEllipse(0, 25, PixiService.NODE_WIDTH, PixiService.NODE_WIDTH/4);
            circle.drawRect(-PixiService.NODE_WIDTH, 13, PixiService.NODE_WIDTH * 2, 13);
            circle.endFill(Color.White);
            circle.lineStyle(1,color,1);
            circle.moveTo(-PixiService.NODE_WIDTH,11);
            circle.lineTo(-PixiService.NODE_WIDTH, 28);
            circle.moveTo(PixiService.NODE_WIDTH, 11);
            circle.lineTo(PixiService.NODE_WIDTH, 28);
         
            circle.beginFill(color);
            circle.drawRect(-PixiService.NODE_WIDTH, 0, PixiService.NODE_WIDTH * 2, 16);
            circle.drawEllipse(0, 16, PixiService.NODE_WIDTH, PixiService.NODE_WIDTH/3.5);
            circle.endFill(color);
            circle.lineStyle(0);
            circle.beginFill(Color.White);            
            circle.drawEllipse(0, 0, PixiService.NODE_WIDTH, PixiService.NODE_WIDTH/4);
            circle.drawRect(-PixiService.NODE_WIDTH, -12, PixiService.NODE_WIDTH * 2, 13);
            circle.endFill(Color.White);
            circle.lineStyle(1,color,1);
            circle.moveTo(-PixiService.NODE_WIDTH,-12);
            circle.lineTo(-PixiService.NODE_WIDTH, 3);
            circle.moveTo(PixiService.NODE_WIDTH,-12);
            circle.lineTo(PixiService.NODE_WIDTH, 3);
        	
            circle.beginFill(color);
            circle.drawRect(-PixiService.NODE_WIDTH, -25, PixiService.NODE_WIDTH * 2, 16);
            circle.drawEllipse(0, -9, PixiService.NODE_WIDTH, PixiService.NODE_WIDTH/3.5);
            circle.endFill(color);
            circle.lineStyle(0);
            circle.beginFill(Color.White);
            circle.drawEllipse(0, -25, PixiService.NODE_WIDTH, PixiService.NODE_WIDTH/4);
            circle.drawRect(-PixiService.NODE_WIDTH, -40, PixiService.NODE_WIDTH * 2, 16);
            circle.endFill(Color.White);
            circle.lineStyle(1,color,1);
            circle.moveTo(-PixiService.NODE_WIDTH,-40);
            circle.lineTo(-PixiService.NODE_WIDTH, -20);
            circle.moveTo(PixiService.NODE_WIDTH,-40);
            circle.lineTo(PixiService.NODE_WIDTH, -20);
            
            circle.beginFill(color);
            circle.drawEllipse(0, -49, PixiService.NODE_WIDTH, PixiService.NODE_WIDTH/3.25);
            circle.drawRect(-PixiService.NODE_WIDTH, -49, PixiService.NODE_WIDTH * 2, 14);
            circle.drawEllipse(0, -35, PixiService.NODE_WIDTH, PixiService.NODE_WIDTH/3.25);
            circle.endFill(color);
        } else {
        	if (circle.NodeType === NodeType.DATASET || circle.NodeType === NodeType.SQL_TEMPLATE) {
                circle.lineStyle(2, color, 1);
                circle.beginFill(Color.White);
                circle.drawCircle(0, 0, PixiService.NODE_WIDTH + 5);
                circle.endFill(Color.White);
            }
            circle.lineStyle(0, Color.Black, 1);
            circle.beginFill(color);
            circle.drawCircle(0, 0, PixiService.NODE_WIDTH);
            circle.endFill(color);
        }
        this.redraw = true;
    }

    replaceNodeText(selectedNode, resultSetNode, displayText) {
    	var graphicsObj = selectedNode.circle;
    	var rsGraphicsObj = this.recordsMap[resultSetNode.id];
    	if (!displayText) {
    		graphicsObj.displayName = null;
    		rsGraphicsObj.displayName = null;
    	} else {
    		graphicsObj.displayName = displayText;
    		rsGraphicsObj.displayName = displayText;
    	}
    	graphicsObj.removeChildren();
    	rsGraphicsObj.removeChildren();
    	this.buildNodeText(graphicsObj, selectedNode.node);
    	this.buildNodeText(rsGraphicsObj, resultSetNode);
    	this.stable = false;
    }
    
    private buildNodeText(graphicsObject, node) {
    	var name = this.analyzeText(node);
		var text = new PIXI.Text(name, PixiService.style);
		text.anchor = PixiService.centerAnchor;
		text.cacheAsBitmap = true;
		if (node.data.NodeType === NodeType.SQL_DATASET) text.position.y = -41;
		graphicsObject.addChild(text);

		text = new PIXI.Text(name, PixiService.styleBig);
		text.anchor = PixiService.centerAnchor;
		text.cacheAsBitmap = true;
		if (node.data.NodeType === NodeType.SQL_DATASET) text.position.y = -41;
		graphicsObject.addChild(text);
		
		text = new PIXI.Text(name, PixiService.styleSmall);
		text.anchor = PixiService.centerAnchor;
		text.cacheAsBitmap = true;
		if (node.data.NodeType === NodeType.SQL_DATASET) text.position.y = -41;
		graphicsObject.addChild(text);
    }
    
    assignFailedRectangles(memberList) {
    	_.keys(this.failedMembers).forEach(ele => {
    		this.failedMembers[ele].violations.length = 0;
    		if (this.failedMembers[ele].NodeType === NodeType.LINK_BOX) {
    			this.paintLinkBox(this.failedMembers[ele]);  
    		} else {
        		this.paintRectangle(this.failedMembers[ele]);    			
    		}
    	});
    	this.failedMembers = [];
    	memberList.forEach(member => {
    		var rectangle = this.membersMap[member.name];
    		if (rectangle) {
    			this.failedMembers[member.name] = rectangle;
    			rectangle.violations.push(member.member.violations);
    			this.paintRectangle(rectangle);
    		} else {
    			var splitName = member.name.split('+');
    			var linkBox = this.linksMap[splitName.reverse().join('+')];
    			if (linkBox) {
    				this.failedMembers[member.name] = linkBox;
    				linkBox.violations.push(member.member.violations);
        			this.paintLinkBox(linkBox);
    			}
    		}
    	})
    }
    
    assignFailedCircles(nodeList) {
    	_.keys(this.failedNodes).forEach(ele => {
    		this.failedNodes[ele].violations.length = 0;
    		this.paintNode(this.failedNodes[ele]);
    	});
    	this.failedNodes = [];
    	nodeList.forEach(node => {
    		var circle = this.recordsMap[node.name];
    		if (circle) {
    			this.failedNodes[node.name] = circle;
    			circle.violations.push(node.node.violations);
    			this.paintNode(circle);
    		}
    	})
    }
    
    private inferColor(graphicsObject) {
        if (this.selected && ((graphicsObject.name === this.selected.selectedNode.name) || ( this.selected.selectedMember && graphicsObject.name.split('+')[0] === this.selected.selectedMember.name && graphicsObject.name.split('+')[1] === this.selected.selectedNode.name))) {
    		return Color.LightBlue;
    	}
    	if (graphicsObject.isFormulaRef) {
    		if (graphicsObject.isHovered) return Color.LightGreen;
    		return Color.Green;
    	}
    	if (graphicsObject.violations.length) {
    		if (graphicsObject.isHovered) return Color.LightRed;
    		return Color.Red;
    	}
    	if (graphicsObject.name.indexOf('+') > 0 && graphicsObject.name.endsWith(':sql')) {
    		if (graphicsObject.isHovered) return Color.MediumBlue;
    		return Color.DarkBlue;
    	}
        var memberCheck = <any>[NodeType.MEMBER, NodeType.LIST, NodeType.DELAY];
    	switch(graphicsObject.NodeType) {
    		case NodeType.MEMBER:
    		case NodeType.LIST:
    		case NodeType.DELAY:
    			if (graphicsObject.isHovered) return Color.LightOrange;
    			return Color.DarkOrange;
    		case NodeType.KEY:
    		case NodeType.SQL_PARAMETER:
    			if (graphicsObject.isHovered) return Color.LightAquamarine;
    			return Color.DarkAquamarine;
    		case NodeType.RECORD:
    		case NodeType.RESULT_SET:
    		case NodeType.LINK_BOX:
				if (graphicsObject.isHovered) return Color.LightOtherBlue;
				return Color.OtherBlue;
    		default:
        		if (graphicsObject.isHovered) return Color.MediumBlue;
    			return Color.DarkBlue;
    	}
    }

    private paintRectangle(rectangle) {
        rectangle.clear();
        var color = this.inferColor(rectangle);
        if (rectangle.NodeType === NodeType.LIST) {
            rectangle.lineStyle(2, color, 1);
            rectangle.beginFill(Color.White);
            rectangle.drawRect(-PixiService.NODE_WIDTH + 10, -3 * PixiService.NODE_WIDTH / 10 + 10, PixiService.NODE_WIDTH * 2, 3 * PixiService.NODE_WIDTH / 5);
            rectangle.drawRect(-PixiService.NODE_WIDTH + 5, -3 * PixiService.NODE_WIDTH / 10 + 5, PixiService.NODE_WIDTH * 2, 3 * PixiService.NODE_WIDTH / 5);
        }
        rectangle.lineStyle(2, color, 1);
        rectangle.beginFill(color);
        rectangle.drawRect(-PixiService.NODE_WIDTH, -3 * PixiService.NODE_WIDTH / 10, PixiService.NODE_WIDTH * 2, 3 * PixiService.NODE_WIDTH / 5);
        rectangle.endFill(color);
        this.redraw = true;
    }

    private paintLinkBox(linkBox) {
    	var color = this.inferColor(linkBox);
        linkBox.clear();
        linkBox.beginFill(color);
        linkBox.drawRect(0, 0, PixiService.NODE_WIDTH*1.5, PixiService.NODE_WIDTH/2);
        linkBox.endFill(color);
        linkBox.pivot = new PIXI.Point(PixiService.NODE_WIDTH/1.375, PixiService.NODE_WIDTH/4);
        this.redraw = true;
    }
    
	private drawGraph(graphics, nodePositions, linkPositions, dataSetLinkPositions, memberLinkPositions, animateNode, animateNodeZoom) {
		graphics.clear();
		var i, x, y, x1, y1, link, ratio, newX, newY;		
		graphics.lineStyle(2, Color.Gray, 0.8);
		graphics.updatePos(this.curMousePos);
		if (animateNode.isPanning && animateNode.ratioIndex < 60 && !this.isTracking) {
			var ratio = this.animationStepRatios[animateNode.ratioIndex];
			animateNode.ratioIndex++;
			if (graphics.scale.x < 1) {
				animateNode.zoom = true;
			}
			var targetPos = this.getGraphCoordinates((window.innerWidth - 300 - (this.sidebarOpen ? 300 : 43))/2, this.height/2);
			newX = ((ratio) * (graphics.x + (targetPos.x - animateNode.node.x) * graphics.scale.x)) + ((1-ratio) * animateNode.canvasPos.x);
            newY = ((ratio) * (graphics.y + (targetPos.y - animateNode.node.y) * graphics.scale.y)) + ((1-ratio) * animateNode.canvasPos.y);
			graphics.x = newX;
			graphics.y = newY;
			graphics.updateTransform();
			this.stable = false;
	    	this.currentBounds = [this.getGraphCoordinates(0,0), this.getGraphCoordinates(this.width,this.height)];
	    	if (animateNode.ratioIndex === 60 || Math.abs((targetPos.x - animateNode.node.x)) < 1) {
	    		this.isTracking = true;
	    		animateNode.ratioIndex = 60;
	    	}
		} else if (this.isTracking) {
				animateNode.isPanning = false;
				if (animateNode.zoom) {
					var newZoom = {
							x: ((this.animationStepRatios[Math.abs(60 -animateNode.ratioIndex)]) * 1) + ((1- this.animationStepRatios[Math.abs(60 -animateNode.ratioIndex)]) * animateNode.scale.x), 
							y: ((this.animationStepRatios[Math.abs(60 -animateNode.ratioIndex)]) * 1) + ((1- this.animationStepRatios[Math.abs(60 -animateNode.ratioIndex)]) * animateNode.scale.y)
					};
					animateNode.ratioIndex--;
					graphics.scale.x = newZoom.x;
					graphics.scale.y = newZoom.y;
					if (animateNode.ratioIndex === 0 || graphics.scale.x >= 0.99) {
						graphics.scale.x = 1;
						graphics.scale.y = 1;
						animateNode.ratioIndex = null;
						animateNode.zoom = false;
						animateNode.isSearch = false;
					}
					var beforeTransform = this.getGraphCoordinates(this.width/2, this.height/2);
					graphics.updateTransform();
					var afterTransform = this.getGraphCoordinates(this.width/2, this.height/2);			
					graphics.position.x += (afterTransform.x - animateNode.node.x) * graphics.scale.x;
					graphics.position.y += (afterTransform.y - animateNode.node.y) * graphics.scale.y;
					this.stable = false;
					graphics.updateTransform();
			    	this.currentBounds = [this.getGraphCoordinates(0,0), this.getGraphCoordinates(this.width,this.height)];
			    	this.graphPos = this.getGraphCoordinates(this.width/2, this.height/2 + 16);
			    	if (graphics.scale.x < 0.1 && this.autoShowHideMembers) {
						if (this.showMembers === true) {
							this.showMembers = !this.showMembers;
							this.$rootScope.$broadcast('autoToggle');
						}
					} else if (graphics.scale.x > 0.1 && this.autoShowHideMembers) {
						 if (this.showMembers === false) {
							 this.showMembers = !this.showMembers;
							 this.$rootScope.$broadcast('autoToggle');
						 }
					}				
				} else {
					var targetPos = this.getGraphCoordinates((window.innerWidth - 300 - (this.sidebarOpen ? 300 : 43))/2, this.height/2);
					var newX = (graphics.position.x + (targetPos.x - animateNode.node.x) * graphics.scale.x);
					var newY = (graphics.position.y + (targetPos.y - animateNode.node.y) * graphics.scale.y);
		            graphics.x = newX;
					graphics.y = newY;
					graphics.updateTransform();
					this.currentBounds = [this.getGraphCoordinates(0,0), this.getGraphCoordinates(this.width,this.height)]
					if (this.stable) {
						this.isTracking = false;
						animateNode.node = null; 
						animateNode.origin = null;
						animateNode.isSearch = null;
						animateNode.ratioIndex = null;
					}
				}
			}
		
		var tooltipLayer = graphics.children[5],
			linkTooltipLayer = graphics.children[6],
			linkArrowLayer = graphics.children[1],
			dataSetLinkArrowLayer = graphics.children[2],
			linkLabelLayer = graphics.children[3],
			nodeLayer = graphics.children[4],
			foreignKeyArrowLayer = graphics.children[0];

		
		if (this.showMembers) {
			for (i = 0; i < memberLinkPositions.length; ++i) {
				link = memberLinkPositions[i];
				graphics.moveTo(link.from.x, link.from.y);
				graphics.lineTo(link.to.x, link.to.y);
			}
		}
		var circRefsSeen = {};
		for (i = 0; i < dataSetLinkPositions.length; ++i) {
			link = dataSetLinkPositions[i];
			var linkArrow = dataSetLinkArrowLayer.children[i];
			if (link.to.x >= this.currentBounds[0].x - PixiService.NODE_WIDTH - 20 && link.to.x <= this.currentBounds[1].x + PixiService.NODE_WIDTH + 20 && link.to.y >= this.currentBounds[0].y - PixiService.NODE_WIDTH - 20 && link.to.y <= this.currentBounds[1].y + PixiService.NODE_WIDTH + 20) {
				linkArrow.visible = true;
			} else {
				linkArrow.visible = false;
			}
			graphics.moveTo(link.from.x, link.from.y);
			graphics.lineTo(link.to.x, link.to.y);
			if (linkArrow.visible) {
				ratio = PixiService.NODE_WIDTH / Math.sqrt(Math.pow(link.from.x - link.to.x, 2) + Math.pow(link.from.y - link.to.y, 2));
				newX = ((1 - ratio) * link.to.x) + (ratio * link.from.x);
				newY = ((1 - ratio) * link.to.y) + (ratio * link.from.y);
				linkArrow.rotation = Math.atan2(link.to.y - link.from.y, link.to.x - link.from.x) + 1.5708;
			}
			linkArrow.x = newX;
			linkArrow.y = newY;
		}
		var seen = {};
		var linksToCheck = {};

		var linkName, angle, signs, offset, sign, midpointX, midpointY, endpointX, endpointY, rotatedX, rotatedY, A, B, C, b2, c2, u, k, L;
		for (i = 0; i < linkPositions.length; ++i) {
			link = linkPositions[i];
			if (link.midArc) delete link.midArc;
			var linkArrow = linkArrowLayer.children[i];
			if (link.to.x >= this.currentBounds[0].x - PixiService.NODE_WIDTH - 20 && link.to.x <= this.currentBounds[1].x + PixiService.NODE_WIDTH + 20 && link.to.y >= this.currentBounds[0].y - PixiService.NODE_WIDTH - 20 && link.to.y <= this.currentBounds[1].y + PixiService.NODE_WIDTH + 20) {
				linkArrow.visible = true;
			} else {
				linkArrow.visible = false;
			}
			graphics.moveTo(link.from.x, link.from.y);
			if (seen.hasOwnProperty(link.fromId + link.toId) || seen.hasOwnProperty(link.toId + link.fromId)) {
				linkName = seen.hasOwnProperty(link.fromId + link.toId) ? link.fromId + link.toId : link.toId + link.fromId;
				signs = seen.hasOwnProperty(link.fromId + link.toId) ? [1,0] : [0,1];
				angle = Math.abs(Math.cos(Math.atan2(link.to.y - link.from.y, link.to.x - link.from.x) + 1.5708));
				offset = (50 + (100 * angle)) * (Math.ceil(seen[linkName]/2));
				sign = seen[linkName] % 2 === 0 ? signs[0] : signs[1];
				ratio = Math.abs(offset) / (Math.sqrt(Math.pow(link.from.x - link.to.x, 2) + Math.pow(link.from.y - link.to.y, 2))/2);
				midpointX = (0.5 * link.to.x) + (0.5 * link.from.x);
				midpointY = (0.5 * link.to.y) + (0.5 * link.from.y);
				endpointX = (((1 - ratio) * midpointX) + (ratio * link.from.x)) - midpointX;
				endpointY = (((1 - ratio) * midpointY) + (ratio * link.from.y)) - midpointY;
				rotatedX = sign ? endpointY + midpointX : (-1 * endpointY) + midpointX;
				rotatedY = sign ? (-1 * endpointX) + midpointY : endpointX + midpointY;
				link['midArc'] = {x: rotatedX, y: rotatedY};
				A = 4 * (Math.pow((link.from.x - 2*link.midArc.x + link.to.x),2) + Math.pow((link.from.y - 2*link.midArc.y + link.to.y),2));
				B = 4 * ((link.from.x - 2*link.midArc.x + link.to.x)*(2 * link.midArc.x - 2 * link.from.x) + (link.from.y - 2*link.midArc.y + link.to.y)*(2 * link.midArc.y - 2 * link.from.y));
				C = Math.pow((2 * link.midArc.x - 2 * link.from.x),2) + Math.pow((2 * link.midArc.y - 2 * link.from.y),2);
				b2 = B/(2*A);
				c2 = C/A;
				u = 1 + b2; //ratio = 1 for total length
				k = c2 - (b2*b2);
				L = (Math.sqrt(A)/2) * ((u*Math.sqrt(u*u + k)) - (b2*Math.sqrt(b2*b2 + k)) + k * Math.log( Math.abs(((u+Math.sqrt(u*u + k)))/((b2+Math.sqrt(b2*b2 + k))))));
                ratio = 1- (PixiService.NODE_WIDTH / L)/(1.2 + (0.2 * (Math.ceil(seen[linkName]/2)-1)));
				newX = (1-ratio) * (1-ratio) * link.from.x + 2 * (1-ratio) * ratio * link.midArc.x + ratio * ratio * link.to.x;
				newY = (1-ratio) * (1-ratio) * link.from.y + 2 * (1-ratio) * ratio * link.midArc.y + ratio * ratio * link.to.y;
				linkArrow.rotation = Math.atan2(link.to.y - (0.5 * (0.5 * 0.5 * link.from.y + 2 * 0.5 * 0.5 * link.midArc.y + 0.5 * 0.5 * link.to.y) + 
				(0.5 * link.midArc.y)), link.to.x - (0.5 * (0.5 * 0.5 * link.from.x + 2 * 0.5 * 0.5 * link.midArc.x + 0.5 * 0.5 * link.to.x) + (0.5 * link.midArc.x))) + 1.5708;			
			} else if (link.from.x === link.to.x && link.from.y === link.to.y) {
				if (circRefsSeen[link.fromId] !== undefined) {
					circRefsSeen[link.fromId]++;
				} else {
					circRefsSeen[link.fromId] = 0;
				}
				var xOffset, yOffset, width, height;
				switch(circRefsSeen[link.fromId]) {
					case 1:
						xOffset = PixiService.NODE_WIDTH * -1;
						yOffset = 0;
						newX = link.from.x - (PixiService.NODE_WIDTH * Math.cos(0.8464847));
						newY = link.from.y + (PixiService.NODE_WIDTH * Math.sin(0.8464847));
						linkArrow.rotation = 1.55;
						width = PixiService.NODE_WIDTH * 1.5;
						height = PixiService.NODE_WIDTH / 1.3;
						break;
					case 2:
						xOffset = 0;
						yOffset = PixiService.NODE_WIDTH * -1;
						newX = link.from.x + (PixiService.NODE_WIDTH * Math.cos(2.4172847));
						newY = link.from.y - (PixiService.NODE_WIDTH * Math.sin(2.4172847));
						linkArrow.rotation = -3.20;
						height = PixiService.NODE_WIDTH * 1.5;
						width = PixiService.NODE_WIDTH / 1.3;
						break;
					case 3:
						xOffset = 0;
						yOffset = PixiService.NODE_WIDTH;
						newX = link.from.x - (PixiService.NODE_WIDTH * Math.cos(2.4172847));
						newY = link.from.y + (PixiService.NODE_WIDTH * Math.sin(2.4172847));
						linkArrow.rotation = -0.05;
						height = PixiService.NODE_WIDTH * 1.5;
						width = PixiService.NODE_WIDTH / 1.3;
						break;
					default:
						xOffset = PixiService.NODE_WIDTH;
						yOffset = 0;
						newX = link.from.x + (PixiService.NODE_WIDTH * Math.cos(0.8464847));
						newY = link.from.y - (PixiService.NODE_WIDTH * Math.sin(0.8464847));
						linkArrow.rotation = -1.65;
						width = PixiService.NODE_WIDTH * 1.5;
						height = PixiService.NODE_WIDTH / 1.3;
						break;
				}
				linkArrow.x = newX;
				linkArrow.y = newY;
				graphics.drawEllipse(link.from.x + xOffset, link.from.y + yOffset, width, height);
				continue;
			} else {
				if (linkArrow.visible) {
					ratio = (PixiService.NODE_WIDTH + (link.toId.includes(':sql') ? 5 : 0)) / Math.sqrt(Math.pow(link.from.x - link.to.x, 2) + Math.pow(link.from.y - link.to.y, 2));
					newX = ((1 - ratio) * link.to.x) + (ratio * link.from.x);
					newY = ((1 - ratio) * link.to.y) + (ratio * link.from.y);
					linkArrow.rotation = Math.atan2(link.to.y - link.from.y, link.to.x - link.from.x) + 1.5708;
				}
			}
			if(seen.hasOwnProperty(link.fromId + link.toId)){
				seen[link.fromId + link.toId]++;	
			} else if (seen.hasOwnProperty(link.toId + link.fromId)) {
				seen[link.toId + link.fromId]++;
			} else {
				seen[link.fromId + link.toId] = 1;
			}
			if (seen[linkName] % 2 === 0) {
				linksToCheck[linkName] = link; 
			} else {
				delete linksToCheck[linkName];
			}
			linkArrow.x = newX;
			linkArrow.y = newY;
		}
		var check = Object.keys(linksToCheck);
		if (check.length > 0) {
			var linkNames = linkPositions.map(ele => ele.fromId + ele.toId);
			for (var i:any = 0; i < check.length; i++) {
				link = linkPositions[linkNames.indexOf(check[i])];
				var link2 = linkPositions[linkNames.indexOf(link.toId +link.fromId)]
				if (link && link2) {
					link = linkPositions[Math.min(...[linkNames.indexOf(check[i]), linkNames.indexOf(linkPositions[linkNames.indexOf(check[i])].toId + linkPositions[linkNames.indexOf(check[i])].fromId)])];
				} else {
					link = link ? link : link2;
				}
				linkName = seen.hasOwnProperty(link.fromId + link.toId) ? link.fromId + link.toId : link.toId + link.fromId;
				signs = seen.hasOwnProperty(link.fromId + link.toId) ? [1,0] : [0,1];
				var linkArrow = linkArrowLayer.children[linkNames.indexOf(check[i])];
				angle = Math.abs(Math.cos(Math.atan2(link.to.y - link.from.y, link.to.x - link.from.x) + 1.5708));
				offset = (50 + (100 * angle)) * (Math.floor(seen[linkName]/2));
				sign = seen[linkName] % 2 === 0 ? signs[0] : signs[1];
				ratio = Math.abs(offset) / (Math.sqrt(Math.pow(link.from.x - link.to.x, 2) + Math.pow(link.from.y - link.to.y, 2))/2);
				midpointX = (0.5 * link.to.x) + (0.5 * link.from.x);
				midpointY = (0.5 * link.to.y) + (0.5 * link.from.y);
				endpointX = (((1 - ratio) * midpointX) + (ratio * link.from.x)) - midpointX;
				endpointY = (((1 - ratio) * midpointY) + (ratio * link.from.y)) - midpointY;
				rotatedX = sign ? endpointY + midpointX : (-1 * endpointY) + midpointX;
				rotatedY = sign ? (-1 * endpointX) + midpointY : endpointX + midpointY;
				link['midArc'] = {x: rotatedX, y: rotatedY};			

				A = 4 * (Math.pow((link.from.x - 2*link.midArc.x + link.to.x),2) + Math.pow((link.from.y - 2*link.midArc.y + link.to.y),2));
				B = 4 * ((link.from.x - 2*link.midArc.x + link.to.x)*(2 * link.midArc.x - 2 * link.from.x) + (link.from.y - 2*link.midArc.y + link.to.y)*(2 * link.midArc.y - 2 * link.from.y));
				C = Math.pow((2 * link.midArc.x - 2 * link.from.x),2) + Math.pow((2 * link.midArc.y - 2 * link.from.y),2);
				b2 = B/(2*A);
				c2 = C/A;
				u = 1 + b2; //ratio = 1 for total length
				k = c2 - (b2*b2);
				L = (Math.sqrt(A)/2) * ((u*Math.sqrt(u*u + k)) - (b2*Math.sqrt(b2*b2 + k)) + k * Math.log( Math.abs(((u+Math.sqrt(u*u + k)))/((b2+Math.sqrt(b2*b2 + k))))));
                ratio = 1- (PixiService.NODE_WIDTH / L)/(1.2 + (0.2 * (Math.ceil(seen[linkName]/2)-1)));
				newX = (1-ratio) * (1-ratio) * link.from.x + 2 * (1-ratio) * ratio * link.midArc.x + ratio * ratio * link.to.x;
				newY = (1-ratio) * (1-ratio) * link.from.y + 2 * (1-ratio) * ratio * link.midArc.y + ratio * ratio * link.to.y;
				linkArrow.rotation = Math.atan2(link.to.y - (0.5 * (0.5 * 0.5 * link.from.y + 2 * 0.5 * 0.5 * link.midArc.y + 0.5 * 0.5 * link.to.y) + 
				(0.5 * link.midArc.y)), link.to.x - (0.5 * (0.5 * 0.5 * link.from.x + 2 * 0.5 * 0.5 * link.midArc.x + 0.5 * 0.5 * link.to.x) + (0.5 * link.midArc.x))) + 1.5708;
				linkArrow.x = newX;
				linkArrow.y = newY;
			}
		}

		for (i = 0; i < linkPositions.length; ++i) {
			link = linkPositions[i];
			graphics.moveTo(link.from.x, link.from.y);
			if (link.from.x === link.to.x && link.from.y === link.to.y) continue;
			if (link.hasOwnProperty('midArc')) {
				graphics.quadraticCurveTo(link.midArc.x, link.midArc.y, link.to.x, link.to.y );	
			} else {
				graphics.lineTo(link.to.x, link.to.y);
			}
		}
		
		circRefsSeen = {};
		for (i = 0; i < linkPositions.length; i++) {
			link = linkPositions[i];
			var linkLabel = linkLabelLayer.children[i],
				linkTooltip = linkTooltipLayer.children[i];
			if (link.midArc) {
				newX = 0.5 * 0.5 * link.from.x + 2 * 0.5 * 0.5 * link.midArc.x + 0.5 * 0.5 * link.to.x;
				newY = 0.5 * 0.5 * link.from.y + 2 * 0.5 * 0.5 * link.midArc.y + 0.5 * 0.5 * link.to.y;
			} else if (link.from.x === link.to.x && link.from.y === link.to.y) {
				if (circRefsSeen[link.fromId] !== undefined) {
					circRefsSeen[link.fromId]++;
				} else {
					circRefsSeen[link.fromId] = 0;
				}
				switch(circRefsSeen[link.fromId]) {
					case 1:
						newX = link.to.x - 120;
						newY = link.to.y;
						break;
					case 2:
						newX = link.to.x;
						newY = link.to.y - 120;
						break;
					case 3:
						newX = link.to.x;
						newY = link.to.y + 120;
						break;
					default:
						newX = link.to.x + 120;
						newY = link.to.y;
						break;
				}	
			} else {
				newX = (0.5 * link.to.x) + (0.5 * link.from.x);
				newY = (0.5 * link.to.y) + (0.5 * link.from.y);
			}
			linkLabel.x = newX;
			linkLabel.y = newY;
			linkTooltip.scale =  new PIXI.Point((1/graphics.scale.x * 1), (1/graphics.scale.y * 1));
			linkTooltip.x = this.graphPos.x;
			linkTooltip.y = this.graphPos.y;
			if (newX >= this.currentBounds[0].x - PixiService.NODE_WIDTH && newX <= this.currentBounds[1].x + PixiService.NODE_WIDTH && newY >= this.currentBounds[0].y - PixiService.NODE_WIDTH && newY <= this.currentBounds[1].y + PixiService.NODE_WIDTH) {
				linkLabel.visible = true;
				var bigText = linkLabel.children[1],
					normalText = linkLabel.children[0],
					smallText = linkLabel.children[2];
				if (graphics.scale.x >= 1.2) {
					bigText.visible = true;
					normalText.visible = false;
					smallText.visible = false;
					bigText.scale = PixiService.TEXT_SCALE_BIG;
				} else if (graphics.scale.x >= 0.6 && graphics.scale.x < 1.2) {
					bigText.visible = false;
					smallText.visible = false;
					normalText.visible = true;
					normalText.scale = PixiService.TEXT_SCALE;
				} else if (graphics.scale.x > 0.3 && graphics.scale.x < 0.6) {
					bigText.visible = false;
					normalText.visible = false;
					smallText.visible = true;
					smallText.scale = PixiService.TEXT_SCALE_SMALL;
				} else {
					normalText.visible = false;
					bigText.visible = false;
					smallText.visible = false;
				}
			} else {
				linkLabel.visible = false;
			}
		}
		var memberNodeTypes : any = [NodeType.MEMBER, NodeType.DELAY, NodeType.SQL_PARAMETER, NodeType.KEY, NodeType.LIST];
		for (i = 0; i < nodePositions.length; i++) {
			var node = nodeLayer.children[i],
				tooltip = tooltipLayer.children[i];
			x = nodePositions[i][0].x;
			y = nodePositions[i][0].y;
			node.x = x;
			node.y = y;
			if (x >= this.currentBounds[0].x - PixiService.NODE_WIDTH && x <= this.currentBounds[1].x + PixiService.NODE_WIDTH && y >= this.currentBounds[0].y - PixiService.NODE_WIDTH && y <= this.currentBounds[1].y + PixiService.NODE_WIDTH) {
				if (this.showMembers || !memberNodeTypes.includes(nodePositions[i][1].NodeType)) {
					node.visible = true;
					tooltip.scale =  new PIXI.Point((1/graphics.scale.x * 1), (1/graphics.scale.y * 1));
					tooltip.x = this.graphPos.x;
					tooltip.y = this.graphPos.y;
					var bigText = node.children[1],
						normalText = node.children[0],
						smallText = node.children[2],
						normalIcon = node.children[3],
						largeIcon = node.children[4];
						if (graphics.scale.x >= 1.2) {
							bigText.visible = true;
							normalText.visible = false;
							smallText.visible = false;
							bigText.scale = PixiService.TEXT_SCALE_BIG;
							if (largeIcon && normalIcon) {
								normalIcon.visible = false;
								largeIcon.visible = true;
								largeIcon.scale = PixiService.TEXT_SCALE_BIG;
							}
						} else if (graphics.scale.x >= 0.6 && graphics.scale.x < 1.2) {
							bigText.visible = false;
							normalText.visible = true;
							smallText.visible = false;
							normalText.scale = PixiService.TEXT_SCALE;
							if (largeIcon && normalIcon) {
								normalIcon.visible = true;
								largeIcon.visible = false;
								normalIcon.scale = PixiService.TEXT_SCALE;
							}
						} else if (graphics.scale.x > 0.3 && graphics.scale.x < 0.6) {
							bigText.visible = false;
							normalText.visible = false;
							smallText.visible = true;
							smallText.scale = PixiService.TEXT_SCALE_SMALL;
							if (largeIcon && normalIcon) {
								normalIcon.visible = true;
								largeIcon.visible = false;
								normalIcon.scale = PixiService.TEXT_SCALE;
							}
						} else {
							bigText.visible = false;
							normalText.visible = false;
							smallText.visible = false;
							if (largeIcon && normalIcon) {
								largeIcon.visible = false;
								normalIcon.visible = false;
							}
						}
				} else {
					node.visible = false;
				}
			} else {
				node.visible = false;
			}
		}
		if (this.showMembers) {
			var splitName,from,to,isRecord;
			this.foreignKeys.forEach( (ele, i) => {
				splitName = this.foreignKeys[i].split('--');
				from = this.membersMap[splitName[0]] || this.linksMap[splitName[0].split('+').reverse().join('+')];
				to = this.membersMap[splitName[1].split('+').reverse().join('+')] || this.linksMap[splitName[1]];
				if (to && from) {
					isRecord = this.linksMap[splitName[1]] ? true : false;
					var animateCoords = null;
					if (this.newForeignKey && i === this.foreignKeys.length-1) {
						animateCoords = this.animateDashedLine(graphics, from.position, to.position);
					} else {
						this.dashedLineTo(graphics, from.position, to.position);
					}
					var arrow = <PIXI.Graphics>_.find(foreignKeyArrowLayer.children, (triangle) => triangle['name'] === this.foreignKeys[i]);
					if ((to.x >= this.currentBounds[0].x - PixiService.NODE_WIDTH - 20 && to.x <= this.currentBounds[1].x + PixiService.NODE_WIDTH + 20 && to.y >= this.currentBounds[0].y - PixiService.NODE_WIDTH - 20 && to.y <= this.currentBounds[1].y + PixiService.NODE_WIDTH + 20) || (this.newForeignKey && i === this.foreignKeys.length-1)) {
						arrow.visible = true;
						arrow.rotation = Math.atan2(to.y - from.y, to.x - from.x) + 1.5708;
						var height = isRecord ? PixiService.NODE_WIDTH / 4 : 3 * PixiService.NODE_WIDTH / 10;
						var width = isRecord ? PixiService.NODE_WIDTH * 0.75 : PixiService.NODE_WIDTH
						ratio = Math.min(Math.abs((width / Math.cos(arrow.rotation - 1.5708))), Math.abs((height / Math.sin(arrow.rotation - 1.5708)))) /  Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
						arrow.position.x = animateCoords ? Math.abs(animateCoords.x - to.x) > Math.abs((((1 - ratio) * to.x) + (ratio * from.x)) - to.x) ? animateCoords.x : ((1 - ratio) * to.x) + (ratio * from.x) : ((1 - ratio) * to.x) + (ratio * from.x);
						arrow.position.y = animateCoords ? Math.abs(animateCoords.y - to.y) > Math.abs((((1 - ratio) * to.y) + (ratio * from.y)) - to.y) ? animateCoords.y : ((1 - ratio) * to.y) + (ratio * from.y) : ((1 - ratio) * to.y) + (ratio * from.y);
					} else {
						arrow.visible = false;
					}
				} else {
					var arrow = <PIXI.Graphics>_.find(foreignKeyArrowLayer.children, (triangle) => triangle['name'] === this.foreignKeys[i]);
					if (arrow) arrow.visible = false;
				}
			});	
		} else {
			foreignKeyArrowLayer.children.forEach(arrow => {arrow.visible = false});
		}
	}
	private animateDashedLine(graphics, from, to) {
		var ratio = 1 - ((60 - this.remainingFramesAfterStable)/60);
		var x = ((1 - ratio) * to.x) + (ratio * from.x);
		var y = ((1 - ratio) * to.y) + (ratio * from.y);
		var coordinates = {x: x, y: y};
		this.dashedLineTo(graphics, from, coordinates);
		return coordinates;
	}
	
	private dashedLineTo(graphics, from, to) {
		var ratio = (PixiService.NODE_WIDTH / 2) / Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
		var ratioIncrement = ratio;
		var newX = ((1 - ratio) * to.x) + (ratio * from.x);
		var newY = ((1 - ratio) * to.y) + (ratio * from.y);
		graphics.moveTo(newX, newY);
		var endRatio = 1 - ratio;
		while (ratio < endRatio) {
			graphics.lineTo((((1 - (ratio + ratioIncrement)) * to.x) + ((ratio + ratioIncrement )* from.x))  , (((1 - (ratio + ratioIncrement)) * to.y) + ((ratio + ratioIncrement) * from.y)));
			ratio += ratioIncrement;
			graphics.moveTo((((1 - (ratio + ratioIncrement)) * to.x) + ((ratio + ratioIncrement )* from.x))  , (((1 - (ratio + ratioIncrement)) * to.y) + ((ratio + ratioIncrement) * from.y)));
			ratio += ratioIncrement;
		}	
	}
	
	private analyzeText(record) {
		var recordName =  record.id;
		var rectangleCheck = <any>[NodeType.MEMBER, NodeType.KEY, NodeType.LIST, NodeType.SQL_PARAMETER, NodeType.DELAY, NodeType.LINK_BOX];
		if (rectangleCheck.includes(record.data.NodeType)) {
			recordName = recordName.split('+')[0]; //record.data.NodeType === NodeType.DELAY ? "Delay (ms)" :  recordName.split('+')[0];
		} else if (record.data.NodeType === NodeType.SQL_DATASET) {
			recordName = recordName.substring(0, recordName.length - 4);
		} else if (record.data.NodeType === NodeType.SQL_TEMPLATE) {
			recordName = record.data.displayName || recordName.split(':')[1].toUpperCase();
		} else if (NodeType.RESULT_SET === record.data.NodeType || NodeType.METADATA === record.data.NodeType) {
			recordName = record.data.displayName || recordName.split(':')[1];
		} else {
			recordName = recordName.split(':')[0];
		}
		var metrics = PIXI.TextMetrics.measureText(recordName, PixiService.style);
		return metrics.lines.length > 2 ? recordName.slice(0,  metrics.lines[0].length + metrics.lines[1].length - 2) + "..." : recordName;
	}
	
	private analyzeLinkText(displayText) {
		var i = 0;
		var value = "";
		if (PIXI.TextMetrics.measureText(displayText, PixiService.styleLinkMeasure).width >= ((PixiService.NODE_WIDTH * 1.5) - (PixiService.NODE_WIDTH * 0.1)) * 2) {
			while (i < displayText.length && 
			(PIXI.TextMetrics.measureText(value, PixiService.styleLinkMeasure).width < ((PixiService.NODE_WIDTH * 1.5) - (PixiService.NODE_WIDTH * 0.1)) * 2)){
				value += displayText[i];
				i++;
			}
			return value.slice(0, value.length-4) + "...";
		} 
		return displayText;
	}
	
	private goToNode(node, canvas, animateNode, animateNodeZoom, isSearch) { 
			this.isTracking = false;
			animateNode.isPanning = true;
			animateNode.canvasPos = canvas.position;
			animateNode.origin = this.getGraphCoordinates((window.innerWidth - 300 - (this.sidebarOpen ? 300 : 43))/2, this.height/2);
            animateNode.node = node;
            animateNode.ratioIndex = 0;
            animateNode.isSearch = isSearch;
            animateNode.scale = canvas.scale;
    }

	private hideTooltip(graphic) {
		for (var i = 0; i < graphic.children.length; i++) {
			var text = graphic.children[i];
			if (text) {
				text.destroy();
			}
		}
		graphic.clear();
	}

	private showTooltip(graphic, canvas, node : any, normalize : boolean) {
		var style = new PIXI.TextStyle({
			align: 'center',
			fill: '#000000',
			fontFamily: 'Arial',
			fontSize: 24,
			padding: 10,
		});
		var text = node.textString || node.name;
		var normalized = '';
		var rectangleCheck = <any>[NodeType.MEMBER, NodeType.KEY, NodeType.LIST, NodeType.SQL_PARAMETER, NodeType.DELAY];
		if (!normalize) {
			normalized = text;
		} else if (rectangleCheck.includes(node.NodeType)) {
			normalized = text.split('+')[0];
		} else if (node.NodeType === NodeType.SQL_DATASET) {
			normalized = text.substring(0, text.length - 4);
		} else if (node.NodeType === NodeType.SQL_TEMPLATE) {
			normalized = node.displayName || text.split(':')[1].toUpperCase();
		} else if (NodeType.RESULT_SET === node.NodeType || NodeType.METADATA === node.NodeType) {
			normalized = node.displayName || text.split(':')[1];
		} else {
			normalized = text.split(':')[0];
		}
		var tooltip = new PIXI.Text(normalized, style),
			metrics = PIXI.TextMetrics.measureText(normalized, style),
			width = metrics.width / 2 + 5,
			height = metrics.height / 2 + 5;
		tooltip.scale = PixiService.TEXT_SCALE;
		if (this.graphPos.x - width * (1/canvas.scale.x) < this.currentBounds[0].x) {
			graphic.pivot = new PIXI.Point(0, height);
		} else if (this.graphPos.x + width * (1/canvas.scale.x) > this.currentBounds[1].x) {
			graphic.pivot = new PIXI.Point(width, height);
		} else if (this.graphPos.y - height * (1/canvas.scale.y) < this.currentBounds[0].y) {
			graphic.pivot = new PIXI.Point(width, 0);
		} else {
			graphic.pivot = new PIXI.Point(0, height);
		}
		if (this.graphPos.x - width * (1/canvas.scale.x) < this.currentBounds[0].x && this.graphPos.y - height * (1/canvas.scale.y)< this.currentBounds[0].y) {
			graphic.pivot = new PIXI.Point(-10,0);
		}
		if (this.graphPos.x + width * (1/canvas.scale.x) > this.currentBounds[1].x && this.graphPos.y - height * (1/canvas.scale.y)< this.currentBounds[0].y) {
			graphic.pivot = new PIXI.Point(width+10,0);
		}
		graphic.lineStyle(1, Color.Black, 1);
		graphic.beginFill(Color.White);
		graphic.drawRect(0, 0, width, height);
		graphic.endFill(Color.White);
		graphic.position.set(this.graphPos.x, this.graphPos.y);
		tooltip.anchor = new PIXI.ObservablePoint(null, null, 0.5, 0.5);
		tooltip.cacheAsBitmap = true;
		tooltip.position.set(width / 2, height / 2);
		graphic.addChild(tooltip);
		graphic.scale = new PIXI.Point((1/canvas.scale.x * 1), (1/canvas.scale.y * 1));
		return graphic;
	}

	bindGlobalInput(graphics, layout) {
		var graphGraphics = graphics.graphGraphics;
		this.addWheelListener(graphics.domContainer, (e) => {
			if (this.sidebarOpen) {
				zoom(e.clientX - 300, e.clientY - 180, e.deltaY < 0);
			} else {
				zoom(e.clientX - 43, e.clientY - 120, e.deltaY < 0);
			}
			this.redraw = true;
		}, null);

		var addDragNDrop = () => {

			var isDragging,
				dragDistance,
				prevX, prevY, NodePos,
				nodeUnderCursorOffset;

			graphics.stage.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
			graphics.stage.mousedown = (moveData) => {
				if (!this.$rootScope.isMetadataValid) return;
				var pos = moveData.data.global;
				this.graphPos = this.getGraphCoordinates(pos.x, pos.y);
				this.curMousePos = pos;
				if (this.nodeUnderCursor) {
					// just to make sure layouter will not attempt to move this node
					// based on physical forces. Now it's completely under our control:
					if((this.nodeUnderCursor.data.isMember && this.showMembers) || !this.nodeUnderCursor.data.isMember) {
						layout.pinNode(this.nodeUnderCursor, true);
						NodePos = layout.getNodePosition(this.nodeUnderCursor.id);
						nodeUnderCursorOffset = { x: NodePos.x - this.graphPos.x, y: NodePos.y - this.graphPos.y };
					} else {
						this.nodeUnderCursor = null;
					}
				} else {
					this.isTracking = false;
				}

				prevX = pos.x; prevY = pos.y;
				isDragging = true;
				dragDistance = 0;
			};

			this.$document.on('mousemove', function(e) {
				if (isDragging) {
					if (e.stopPropagation) e.stopPropagation();
					if (e.preventDefault) e.preventDefault();
					e.cancelBubble = true;
					e.returnValue = false;
				}
			});
			graphGraphics.updatePos = (mousePos) => {
				if (mousePos) {
					this.graphPos = this.getGraphCoordinates(mousePos.x, mousePos.y);
				}
			}
			
			graphics.stage.mousemove = (moveData) => {
				if (!this.$rootScope.isMetadataValid) return;
				var pos = moveData.data.global;
				this.curMousePos = pos;
				if (!isDragging) {
					this.graphPos = this.getGraphCoordinates(pos.x, pos.y);
					return;
				}
				this.graphPos = this.getGraphCoordinates(pos.x, pos.y);
				
				var dx = pos.x - prevX;
				var dy = pos.y - prevY;
				prevX = pos.x; prevY = pos.y;
				dragDistance += Math.abs(dx) + Math.abs(dy);
				if (this.nodeUnderCursor) {
					if (dragDistance <= 1) {
						// make the user moves the mouse more than 1px to start moving the node
						return;
					}
					this.draggingNode = true;
					layout.setNodePosition(this.nodeUnderCursor.id, this.graphPos.x + nodeUnderCursorOffset.x, this.graphPos.y + nodeUnderCursorOffset.y);
					this.stable = false;
				} else {
					graphGraphics.position.x += dx;
					graphGraphics.position.y += dy;
					this.currentBounds = getViewRange();
					this.redraw = true;
				}
			}

			graphics.stage.mouseup = (moveDate) => {
				if (!this.$rootScope.isMetadataValid) return;
				isDragging = false;
				if (this.nodeUnderCursor) {
					this.draggingNode = false;
					layout.pinNode(this.nodeUnderCursor, false);
					this.nodeUnderCursor = null;
				}
			};
		}

		addDragNDrop();

		var getViewRange = () => {
			return [this.getGraphCoordinates(0,0), this.getGraphCoordinates(this.width,this.height)];
		}		
		var resizeCanvas = () => {
            if (graphics.renderer.screen) {
			    this.sidebarOpen = this.commonNavigationState.getNavPanelState().opened;
			    var body = $(document.getElementsByClassName("common-navigation")[0]);
			    this.height = body.height() - (this.sidebarOpen ? 180 : 120) + 1;
			    this.width = body.width() - (this.sidebarOpen ? 300 : 43) + (this.$rootScope.showMetadata ? -300 : 0);
			    graphics.stage.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
                graphics.renderer.resize(this.width, this.height);
                this.currentBounds = getViewRange();
			    this.redraw = true;
            }
		}
		this.$rootScope.$on('navPanelStateChanged', resizeCanvas);
		window.onresize = resizeCanvas;

		var animateNode = () => {
			if (!this.$rootScope.showMetadata) {
    		  this.addMetadataSidebar = true;
			}
			resizeCanvas();
		}
		this.$rootScope.$watch('showMetadata', animateNode);

		this.getGraphCoordinates = (function () {
			var ctx = {
				global: { x: 0, y: 0 } // store it inside closure to avoid GC pressure
			};
			return function (x, y) {
				ctx.global.x = x; ctx.global.y = y;
				return PIXI.interaction.InteractionData.prototype.getLocalPosition.call(ctx, graphGraphics);
			}
		}());
		var initialBounds = layout.simulator.bodies.reduce((acc,ele) => {
				acc.min.x = ele.pos.x < acc.min.x ? ele.pos.x : acc.min.x;
				acc.min.y = ele.pos.y < acc.min.y ? ele.pos.y : acc.min.y;
				acc.max.x = ele.pos.x > acc.max.x ? ele.pos.x : acc.max.x;
				acc.max.y = ele.pos.y > acc.max.y ? ele.pos.y : acc.max.y;
				return acc;
			}, {min: {x:Infinity,y:Infinity}, max: {x:-1 * Infinity, y:-1 * Infinity}});
		this.currentBounds = [this.getGraphCoordinates(0,0),this.getGraphCoordinates(this.width,this.height)];
		while(this.currentBounds[0].x > initialBounds.min.x - PixiService.NODE_WIDTH || this.currentBounds[0].y > initialBounds.min.y - PixiService.NODE_WIDTH || this.currentBounds[1].x < initialBounds.max.x + PixiService.NODE_WIDTH || this.currentBounds[1].y < initialBounds.max.y + PixiService.NODE_WIDTH) {
			graphGraphics.scale.x -= graphGraphics.scale.x < 0.2 ?  0.01 : 0.03;
			graphGraphics.scale.y -= graphGraphics.scale.y < 0.2 ?  0.01 :  0.03;
			graphGraphics.updateTransform();
			this.currentBounds = [this.getGraphCoordinates(0,0),this.getGraphCoordinates(this.width,this.height)];
		}
		if(this.autoShowHideMembers && graphGraphics.scale.x < 0.1) {
			this.showMembers = false;
			this.$rootScope.$broadcast('autoToggle');
		}

        this.currentBounds = getViewRange();
          
		var zoom = (x, y, isZoomIn) => {
			this.isTracking = false;
			var direction = isZoomIn ? 1 : -1;
			var factor = (1 + direction * 0.1);
			graphGraphics.scale.x *= factor;
			graphGraphics.scale.y *= factor;
			// Technically code below is not required, but helps to zoom on mouse
			// cursor, instead center of graphGraphics coordinates
			var beforeTransform = this.getGraphCoordinates(x, y);
			graphGraphics.updateTransform();
			var afterTransform = this.getGraphCoordinates(x, y);
			
			graphGraphics.position.x += (afterTransform.x - beforeTransform.x) * graphGraphics.scale.x;
			graphGraphics.position.y += (afterTransform.y - beforeTransform.y) * graphGraphics.scale.y;
			if (graphGraphics.scale.x < 0.1 && this.autoShowHideMembers) {
				if (this.showMembers === true) {
					this.showMembers = !this.showMembers;
					this.$rootScope.$broadcast('autoToggle');
				}
			} else if (graphGraphics.scale.x > 0.1 && this.autoShowHideMembers) {
				 if (this.showMembers === false) {
					 this.showMembers = !this.showMembers;
					 this.$rootScope.$broadcast('autoToggle');
				 }
			}
			graphGraphics.updateTransform();
			this.currentBounds = getViewRange();
			this.graphPos = this.getGraphCoordinates(x, y + 16);
		}
	}

    public clickedRecordFromSidebar(recordName) {
		if (this.recordsMap[recordName]) {
			  this.recordsMap[recordName].emit('click');
			}	
    }
    
	private addWheelListener(elem, callback, useCapture) {
		this._addWheelListener(elem, this.support, callback, useCapture);

		// handle MozMousePixelScroll in older Firefox
		if (this.support == "DOMMouseScroll") {
			this._addWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
		}
	}

	private _addWheelListener(elem, eventName, callback, useCapture) {
		elem[this._addEventListener](this.prefix + eventName, this.support == "wheel" ? callback : (originalEvent) => {
			//!originalEvent && ( originalEvent = window.event );

			//create a normalized event object
			var event = {
				// keep a ref to the original event object
				originalEvent: originalEvent,
				target: originalEvent.target || originalEvent.srcElement,
				type: "wheel",
				deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
				deltaX: 0,
				deltaY: 0,
				delatZ: 0,
				clientX: originalEvent.clientX,
				clientY: originalEvent.clientY,
				preventDefault: function () {
					if (originalEvent.preventDefault) {
						originalEvent.preventDefault()
					} else {
						originalEvent.returnValue = false;
					}
				}
			};

			// calculate deltaY (and deltaX) according to the event
			if (this.support == "mousewheel") {
				event.deltaY = - 1 / 40 * originalEvent.wheelDelta;
				// Webkit also support wheelDeltaX
				//    	            originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
			} else {
				event.deltaY = originalEvent.detail;
			}

			return callback(event);

		}, useCapture || false);
	}
}

angular.module('tdmApp').service('PixiService', PixiService);
