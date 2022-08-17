//按需导入
import Vue from 'vue'
import { Button, Form, FormItem, Input, Message,Container,Aside,Header,
    Main,Row,Col,Menu,Submenu,MenuItemGroup,MenuItem,Avatar,
    DropdownItem,Dropdown,DropdownMenu,Table,TableColumn,Tag,Popover,Card,
    Switch,Pagination, Dialog,Breadcrumb,BreadcrumbItem,Tree, Cascader,MessageBox,
    Step,Steps,TabPane,Tabs ,Checkbox,CheckboxGroup,Upload,PageHeader,Tooltip,
    Timeline, TimelineItem} from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Row)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Col)
Vue.use(Avatar)
Vue.use(DropdownItem)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag) 
Vue.use(Popover) 
Vue.use(Card) 
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Dialog) 
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Step)
Vue.use(Steps)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(PageHeader)
Vue.use(Tooltip)
Vue.use(Timeline)
Vue.use(TimelineItem)
//全局导入
Vue.prototype.$message=Message
Vue.prototype.$confirm=MessageBox.confirm;

