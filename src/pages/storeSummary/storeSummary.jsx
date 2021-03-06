import Taro, { Component } from "@tarojs/taro";
import { View, Text, Picker } from "@tarojs/components";
import "./storeSummary.css";
import * as api from "../../utils/api";
import * as util from "../../utils/util";
import {
  AtAvatar,
  AtButton,
  AtGrid,
  AtList,
  AtListItem,
  AtTabBar
} from "taro-ui";
import SummaryCard from "../../components/summaryCard";

const helpers = [
  "一键发送电子发票",
  "一键发送优惠券",
  "一键发送优惠短信",
  "一键发送优惠即将结束短信",
  "一键生成新的价格条码"
];

export default class StoreSummary extends Component {
  config = {
    navigationBarTitleText: "商铺概览",
    enablePullDownRefresh: true
  };

  id = 0;
  state = {
    storeInfo: {}
  };

  componentWillMount() {
    const storeId = Taro.getStorageSync("store");
    if (!util.isNull(storeId)) {
      this.id = parseInt(storeId);
    }
  }

  componentDidShow() {
    Taro.startPullDownRefresh();
  }

  onPullDownRefresh() {
    (async () => {
      let response = await api.getStoreInfo({
        id: parseInt(this.id)
      });
      if (response.code === api.errors.Ok) {
        this.setState({
          storeInfo: response.data
        });
      }
      Taro.stopPullDownRefresh();
    })();
  }

  viewProducts = () => {
    Taro.navigateTo({
      url: `/pages/products/products?fn=getProduct&param={"OwnerID":${parseInt(
        Taro.getStorageSync("store")
      )},"InShelf":true}`
    });
  };

  render() {
    return (
      <View>
        <View className="at-row at-row__align--center">
          <View
            className="at-col at-col-1 at-col--auto"
            style={{
              padding: "10px"
            }}
          >
            <AtAvatar size="normal" circle={true} text="商店" />
          </View>
          <View
            className="at-col"
            style={{
              padding: "10px"
            }}
          >
            <Text
              style={{
                display: "block"
              }}
            >
              {util.value(this.state.storeInfo.Name, "店铺名称")}
            </Text>
            <Text
              style={{
                display: "block",
                color: "gray"
              }}
            >
              {util.value(this.state.storeInfo.FullName, "店铺全称")}
            </Text>
          </View>
          <View
            className="at-col at-col-1 at-col--auto"
            style={{
              padding: "10px"
            }}
          >
            <AtButton
              size="small"
              circle={true}
              onClick={util.makeNavigate("/pages/mine/mine")}
            >
              设置
            </AtButton>
          </View>
        </View>

        <View className="at-row at-row__align--center">
          <View className="at-col">
            <SummaryCard value={34} name="客流量" />
          </View>
          <View className="at-col">
            <SummaryCard value={428} name="营业额" />
          </View>
          <View className="at-col">
            <SummaryCard value={159} name="毛利润" />
          </View>
        </View>

        <AtList>
          <AtListItem
            title="在售商品概览"
            arrow="right"
            onClick={this.viewProducts}
          />
          <AtListItem
            title="会员管理"
            arrow="right"
            onClick={util.makeNavigate("/pages/vips/vips")}
          />
          <AtListItem
            title="商品折扣"
            arrow="right"
            onClick={util.makeNavigate("/pages/tickets/tickets")}
          />
          <AtListItem
            title="商品仓库"
            arrow="right"
            onClick={() =>
              Taro.switchTab({
                url: "/pages/warehouse/warehouse"
              })
            }
          />

          <Picker
            mode="selector"
            range={helpers}
            onChange={() => {
              Taro.showLoading({
                title: "发送中..."
              });
              setTimeout(() => {
                Taro.hideLoading();
                util.addMsg("table", "收到了新的表单！");
                Taro.showToast({
                  title: "已发送，请进入“我的消息”查看",
                  icon: "none"
                });
              }, 2000);
            }}
          >
            <AtListItem title="辅助功能" arrow="right" />
          </Picker>
        </AtList>
      </View>
    );
  }
}
