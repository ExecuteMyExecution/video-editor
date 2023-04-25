<template>
  <div class="box">
    <!-- 编辑的表单 -->
    <el-dialog title="添加/编辑字幕" :visible.sync="dialogFormVisible" width="50%">
      <el-form ref="form" :rules="rules" inline :model="form" label-width="80px">
        <el-form-item label="起始时间" prop="startTime">
          <el-input v-model.number="form.startTime" placeholder="请输入起始时间"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-input v-model.number="form.endTime" placeholder="请输入结束时间"></el-input>
        </el-form-item>
        <el-form-item label="字幕位置" prop="position">
          <el-input v-model="form.position" placeholder="请输入字幕位置"></el-input>
        </el-form-item>
        <el-form-item label="字体大小" prop="fontSize">
          <el-input v-model="form.fontSize" placeholder="带单位，如px"></el-input>
        </el-form-item>
        <el-form-item label="字幕内容" prop="content">
          <el-input v-model="form.content" placeholder="请输入字幕内容"></el-input>
        </el-form-item>
        <el-form-item label="字体颜色" prop="fontColor">
          <div class="block">
            <el-color-picker v-model="form.fontColor"></el-color-picker>
          </div>
        </el-form-item>
        <el-form-item label="选择插入">
          <el-button @click="insert">选择插入</el-button>
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
        <el-table-column prop="fontSize" label="字号" width="180">
        </el-table-column>
        <el-table-column prop="fontColor" label="颜色" width="180">
        </el-table-column>
        <el-table-column prop="content" label="内容">
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // 校验结束事件的函数
    const myValidate = (index) => {
      return (rule, val, cb) => {
        let time = 0;
        if (index == 3) {
          time = this.form.endTime;
          if (time > 0 && time < val) {
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
      form: {
        startTime: 0,
        endTime: 0,
        position: '0,0',
        fontSize: '16px',
        fontColor: '#000',
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
        fontSize: [
          { required: true, message: '不能为空' }
        ],
        fontColor: [
          { required: true, message: '不能为空' }
        ],
        content: [
          { required: true, message: '不能为空' }
        ]
      },
      editIndex: 0,
      tableData: [
        {
          startTime: null,
          endTime: null,
          position: null,
          fontColor: null,
          fontSize: null,
          content: null
        },
      ],
      modelType: 0,    // 0表示新增，1表示编辑
      textParams: {}  // 接收插入的文本参数
    }
  },
  props: ['video'],
  methods: {
    // 添加操作
    handleAdd(index, row) {
      if (row.startTime == null && row.endTime == null) {
        this.modelType = 0;
        this.dialogFormVisible = true;
        this.form.startTime = this.video.currentTime;
        this.form.endTime = this.video.currentTime;
        this.form.content = '';
        this.form.fontColor = '#000';
        this.form.fontSize = '16px';
      }
    },
    // 编辑操作
    handleEdit(index, row) {
      this.modelType = 1;
      this.dialogFormVisible = true;
      // 需要对当前行数据进行深拷贝
      this.form = JSON.parse(JSON.stringify(row));
      this.editIndex = index;
    },
    // 删除操作
    handleDelete(index, row) {
      this.$confirm('是否删除这条字幕?', '提示', {
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
          message: '已取消删除'
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
            this.tableData.splice(this.tableData.length - 1, 0, caption);
          } else {
            // 深拷贝数据、编辑的字幕序号
            let caption = JSON.parse(JSON.stringify(this.form));
            this.tableData.splice(this.editIndex, 1, caption);
          }
          // 更新字幕
          this.updateCaption();
          // 表单置空
          this.$refs.form.resetFields();
          // 关闭弹窗
          this.dialogFormVisible = false;
          // 将插入的选项置为初始值
          this.$bus.$emit('resetInsertCaption');
        }
      })
    },
    // 弹窗关闭触发事件
    handleClose() {
      this.$refs.form.resetFields();
      this.dialogFormVisible = false;
      console.log(214);
    },
    cancel() {
      this.handleClose();
    },
    // 更新字幕操作
    updateCaption() {
      // 将数据信息存储在表格中
      this.$cookie.setCookie({ captions: this.tableData.slice() }, 1);
      // 告知父组件更新数据
      this.$emit('updateCaption', this.tableData.slice());
    },
    // 插入字幕
    insert() {
      this.$emit('insert', 1);
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
    let captions = JSON.parse(this.$cookie.getCookie('captions'));
    if (captions) {
      this.tableData = captions.slice();
    }
  },
  created() {
    // 插入文本参数改变函数
    this.$bus.$on('insertCaption', res => {
      this.textParams = res;
    })
  },
  watch: {
    textParams: function (newVal, oldVal) {
      this.form.content = newVal.text;
      this.form.position = newVal.position;
      this.form.fontSize = newVal.fontSize;
      this.form.fontColor = newVal.fontColor;
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

  ::v-deep .el-dialog {
    background: #3B3B3B;

    .el-dialog__title {
      color: #fff;
    }

    .el-form-item__label {
      color: #eff1f6bf;
    }

    .el-form {

      .el-input {
        .el-input__inner {
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

          &::placeholder {
            color: #999999;
          }
        }
      }

      .el-color-picker {
        .el-color-picker__trigger {
          border: none;
        }
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