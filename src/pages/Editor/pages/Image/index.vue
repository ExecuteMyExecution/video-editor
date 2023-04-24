<template>
  <div class="box">
    <!-- 编辑的表单 -->
    <el-dialog title="添加/编辑贴图" :visible.sync="dialogFormVisible" width="50%">
      <el-form ref="form" :rules="rules" inline :model="form" label-width="80px">
        <el-form-item label="起始时间" prop="startTime">
          <el-input v-model.number="form.startTime" placeholder="请输入起始时间"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-input v-model.number="form.endTime" placeholder="请输入结束时间"></el-input>
        </el-form-item>
        <el-form-item label="贴图位置" prop="position">
          <el-input v-model="form.position" placeholder="请输入贴图位置"></el-input>
        </el-form-item>
        <el-form-item label="图片大小" prop="size">
          <el-input v-model="form.size" placeholder="请输入图片大小"></el-input>
        </el-form-item>
        <el-form-item label="旋转角度" prop="angle">
          <el-input v-model.number="form.angle" placeholder="请输入旋转角度"></el-input>
        </el-form-item>
        <el-form-item label="选取贴图" prop="content" class="last-input">
          <el-input v-model="form.content" placeholder="请输入图片地址"></el-input>
          <el-upload ref="upload" action="https://yijuan.xyz:3001/upload" list-type="picture-card" :auto-upload="false"
            :multiple="false" :limit="1" :http-request="upload" :before-upload="checkFile">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <i class="el-icon-delete"></i>
                </span>
                <span v-if="!disabled" @click="imgSubmit">
                  <i class="el-icon-upload2"></i>
                </span>
              </span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="调整参数">
          <el-button @click="insert">调整参数</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 主体内容表格 -->
    <div class="content">
      <el-table :data="tableData" style="width: 100%" height="100%" row-class-name="my-row"
        header-row-class-name="my-header">
        <el-table-column prop="startTime" label="起始时间" width="180">
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="180">
        </el-table-column>
        <el-table-column prop="position" label="位置" width="180">
        </el-table-column>
        <el-table-column prop="size" label="大小" width="180">
        </el-table-column>
        <el-table-column prop="angle" label="角度" width="180">
        </el-table-column>
        <el-table-column label="内容">
          <template slot-scope="scope">
            <el-button type="mini" v-show="scope.row.content" @click="handlePictureCardPreview(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" v-if="showAdd(scope.row)"
              @click="handleAdd(scope.$index, scope.row)">添加</el-button>
            <el-button size="mini" v-show="!showAdd(scope.row)"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" v-show="!showAdd(scope.row)" type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="dialogVisible" width="40%">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    // 校验结束事件的函数
    const myValidate = (index) => {
      return (rule, val, cb) => {
        let time = 0;
        if(index == 3) {
          time = this.form.endTime;
          if(time > 0 && time < val) {
            cb(new Error(rule.message));
          }
        }
        else {
          if (index != 1) time = this.form.startTime;
          val = +val;
          if (!(val >= time)) {
            cb(new Error(rule.message));
          }
        }
        cb();
      }
    }
    return {
      dialogFormVisible: false,
      dialogVisible: false,
      dialogImageUrl: '',
      disabled: false,
      form: {
        index: -1,
        startTime: 0,
        endTime: 0,
        position: '0,0',
        size: '200,200',
        angle: '0',
        content: ''
      },
      rules: {
        startTime: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '输入值必须为数字' },
          { validator: myValidate(1), message: '起始时间应该大于0' },
          { validator: myValidate(3), message: '起始时间应该小于终止时间' },
        ],
        endTime: [
          { required: true, message: '不能为空' },
          { type: 'number', message: '输入值必须为数字' },
          { validator: myValidate(2), message: '结束时间应该大于起始时间' }
        ],
        position: [
          { required: true, message: '不能为空' }
        ],
        size: [
          { required: true, message: '不能为空' }
        ],
        angle: [
          { required: true, message: '不能为空' }
        ],
        content: [
          { required: true, message: '不能为空' }
        ]
      },
      tableIndex: 1,
      tableData: [
        {
          index: 0,
          startTime: null,
          endTime: null,
          position: null,
          angle: null,
          size: null,
          content: null
        },
      ],
      modelType: 0,    // 0表示新增，1表示编辑
      imageParams: {} // 接收插入的图片参数
    }
  },
  methods: {
    // 添加操作
    handleAdd(index, row) {
      if (row.startTime == null && row.endTime == null) {
        this.modelType = 0;
        this.dialogFormVisible = true;
      }
    },
    // 编辑操作
    handleEdit(index, row) {
      this.modelType = 1;
      this.dialogFormVisible = true;
      // 需要对当前行数据进行深拷贝
      this.form = JSON.parse(JSON.stringify(row));
    },
    // 删除操作
    handleDelete(index, row) {
      this.$confirm('是否删除这条贴图, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.splice(index, 1);
        // 更新字幕
        this.updateCaption();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
          duration: 1000
        });
      })
    },
    // 提交用户表单
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 对数据的后续处理
          if (this.modelType == 0) {
            let caption = JSON.parse(JSON.stringify(this.form));
            caption.index = this.tableIndex++;
            this.tableData.splice(this.tableData.length - 1, 0, caption);
          } else {
            // 深拷贝数据、编辑的字幕序号
            let caption = JSON.parse(JSON.stringify(this.form)), index = 0;
            for (const obj of this.tableData) {
              if (obj.index == this.form.index) {
                break;
              } else {
                index++;
              }
            }
            this.tableData.splice(index, 1, caption);
          }
          // 更新贴图
          this.updateCaption();
          // 表单置空
          this.$refs.form.resetFields();
          // 关闭弹窗
          this.dialogFormVisible = false;
        }
      })
    },
    // 弹窗关闭触发事件
    handleClose() {
      this.$refs.form.resetFields();
      this.dialogFormVisible = false;
      this.handleRemove();
    },
    cancel() {
      this.handleClose();
    },
    // 更新贴图操作
    updateCaption() {
      // 将数据信息存储在表格中
      this.cookie.setCookie({ images: this.tableData.slice() }, 1);
      // 告知父组件更新数据
      this.$emit('updateCaption', this.tableData.slice());
    },
    // 上传图片取消操作
    handleRemove(file) {
      // 删除uploadFiles列表数据
      const uploadFiles = this.$refs.upload.uploadFiles;
      if (uploadFiles.length != 0) {
        uploadFiles.pop();
      }
    },
    // 上传图片预览操作
    handlePictureCardPreview(file) {
      if (file.url) {
        this.dialogImageUrl = file.url;
      } else {
        this.dialogImageUrl = file.content;
      }
      this.dialogVisible = true;
    },
    // 检查文件类型
    checkFile(file) {
      if (!file.type.includes('image')) {
        this.$message.error({
          message: '请上传正确的图片格式！',
          duration: 1000
        })
        return false;
      }
    },
    // 上传图片
    upload(file) {
      // 新建一个FormData对象
      let formData = new FormData();
      formData.append('file', file.file);
      // 发送axios请求
      axios({
        method: 'post',
        url: 'https://yijuan.xyz:3001/upload',
        data: formData,
      }).then(res => {  // 成功后的回调 --> 跳转编辑页
        if (res.status == 200) {
          this.$message.success({
            message: '图片上传成功',
            duration: 1000
          });
        }
        // 设置图片地址cookie
        this.form.content = res.data.url;
      })
    },
    // 上传按钮回调
    imgSubmit() {
      this.$refs.upload.submit();
    },
    // 插入贴图
    insert() {
      this.$emit('insert', 2, this.form.content);
      this.dialogFormVisible = false;
    }
  },
  computed: {
    showAdd() {
      return (row) => row.endTime == null;
    }
  },
  mounted() {
    // 每次挂载从cookie中读取缓存
    let images = JSON.parse(this.cookie.getCookie('images'));
    if (images) {
      this.tableData = images.slice();
    }
  },
  created() {
    this.$bus.$on('insertImage', res => {
      this.imageParams = res;
    })
  },
  watch: {
    imageParams: function (newVal, oldVal) {
      this.form.size = newVal.size;
      this.form.angle = newVal.angle;
      this.form.position = newVal.position;
      if (newVal.startTime >= 0) this.form.startTime = newVal.startTime;
      if (newVal.endTime >= 0) this.form.endTime = newVal.endTime;
      this.dialogFormVisible = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  height: 100%;

  .el-dialog {
    .el-form {
      ::v-deep label {
        color: #eff1f6bf;
      }

      .el-form-item:nth-last-of-type(2) {
        .el-input {
          margin-bottom: 20px;
        }
      }

      .el-input {
        ::v-deep .el-input__inner {
          background-color: #4a4a4a;
          color: #eff1f6bf;
          border: none;
          border-width: 2px;
          border-style: inset;
          border-color: rgb(118, 118, 118);
          border-image: initial;

          &:focus {
            border-color: #ffd04b;
          }
        }
      }

      ::v-deep .el-upload {
        background-color: #4a4a4a;
      }
    }
  }

  .el-menu {
    height: 100%;
    width: 10%;
    text-align: center;
    border: none;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .content {
    background-color: #616060;
    height: 100%;

    .el-table {
      color: #fff;
      background-color: #3b3b3b;

      ::v-deep .my-row {
        background: #3b3b3b;
      }

      &::before {
        height: 0;
      }

      ::v-deep .my-header th {
        color: #fff;
        background: #3b3b3b;
      }

      ::v-deep tbody tr:hover>td {
        background-color: #616060;
      }
    }
  }
}
</style>