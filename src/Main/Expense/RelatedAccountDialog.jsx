'use strict';

var React = require('react/addons');
var _ = require('underscore');
var Dialog = require('material-ui/lib/dialog');
var RadioButton = require('material-ui/lib/radio-button');
var FontIcon = require('material-ui/lib/font-icon');

var polyglot = require('polyglot');
var List = require('Main/List');
var Avatar = require('Main/Avatar');

var styles = {
  content: {
    padding: '16px 0 5px 0',
  },
};

var PaidByDialog = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],
  propTypes: {
    accounts: React.PropTypes.array.isRequired,
    selected: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onDismiss: React.PropTypes.func,
  },
  getInitialState: function() {
    return {
      selected: this.props.selected || '',
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.hasOwnProperty('selected')) {
      this.setState({
        selected: nextProps.selected
      });
    }
  },
  show: function() {
    this.refs.dialog.show();
  },
  dismiss: function() {
    this.refs.dialog.dismiss();
  },
  onTouchTap: function(newSelectedValue) {
    this.setState({
      selected: newSelectedValue
    });

    if (this.props.onChange) {
      var newSelected = _.findWhere(this.props.accounts, {
        _id: newSelectedValue
      });

      this.props.onChange(newSelected);
    }
  },
  onTouchTapAdd: function() {
  },
  render: function () {
    var self = this;
    var props = this.props;
    var icon = <FontIcon className="md-add" />;

    return <Dialog title={polyglot.t('expense_related_account')} ref="dialog"
        contentClassName="testExpenseAddRelatedAccountDialog"
        onDismiss={props.onDismiss} contentInnerStyle={styles.content}>
        {_.map(props.accounts, function(account) {
          var avatar = <Avatar contacts={account.members} />;
          var radioButton = <RadioButton value={account._id} checked={account._id === self.state.selected} />;

          return <List onTouchTap={self.onTouchTap.bind(self, account._id)}
              left={avatar} key={account._id} right={radioButton}>
                {account.name}
            </List>;
        })}
        <List left={icon} onTouchTap={this.onTouchTapAdd}>
          {polyglot.t('add_a_new_account')}
        </List>
      </Dialog>;
  },
});

module.exports = PaidByDialog;
