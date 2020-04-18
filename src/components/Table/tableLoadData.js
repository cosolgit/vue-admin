import {reactive,ref,watch,} from "@vue/composition-api";
import {requestUrl} from "@/api/requestUrl";
import {loadTableData} from "@/api/common";
export function loadData() {
  const tableData = reactive({
    item: [],
    total:0
  })

  const tableLoadData = (params) => {
    const requestData = {
      url: requestUrl[params.url],
      method: params.method,
      data: params.data
    }
    loadTableData(requestData).then(response => {
      let responseData = response.data.data.data;
      //后台返回数据时,并不是一个数组,有时返回一个空
      if (responseData && responseData.length > 0) {
        tableData.item = responseData;
        tableData.total=response.data.data.total;
      }
    }).catch(error => {})
  }

  return {
    tableData,
    tableLoadData
  }
}